<template>
    <div class="flex flex-col h-dvh w-full overflow-y-hidden">
        <div class="h-16 px-4 flex justify-between items-center">
            <h6 class="font-normal">Order Summary</h6>
            <router-link
                :to="{ name: 'Cart', params: { storeSlug: storeSlug, eventSlug: eventSlug } }"
                class="underline text-spanish-viridian text-xs"
                >Edit All</router-link
            >
        </div>

        <div class="flex-1 overflow-y-auto px-4 pt-2 pb-4">
            <SummaryItem v-for="item in cart" :key="item.id" :item="item" />

            <ShippingSummary
                v-if="Object.values(shippingDetails).some((field) => field !== '')"
                :shippingDetails="shippingDetails"
            />
        </div>

        <SummaryTotal
            :total-products="totalProducts"
            :cart-total="cartTotal"
            :total-amount="totalAmount"
            :shipping-details="shippingDetails"
            :is-pending="isPending"
            @checkout="visibleBottom = true"
        />

        <Drawer
            v-model:visible="visibleBottom"
            header="Payment Method"
            position="bottom"
            style="height: auto"
            class="!rounded-md !mx-2 !my-2"
        >
            <div class="flex gap-3">
                <label for="Offline" class="w-full cursor-pointer p-3 rounded-md bg-anti-flash-white block">
                    <div class="flex justify-between items-center">
                        <span>Pay Offline</span>
                        <RadioButton v-model="paymentMethod" inputId="Offline" name="paymentMethod" value="Offline" />
                    </div>
                    <p class="text-granite-gray leading-none text-xs mt-2">Cash, POS, or Transfer</p>
                </label>

                <label for="Online" class="w-full cursor-pointer p-3 rounded-md bg-anti-flash-white block">
                    <div class="flex justify-between items-center">
                        <span>Pay Online</span>
                        <RadioButton v-model="paymentMethod" inputId="Online" name="paymentMethod" value="Online" />
                    </div>
                    <p class="text-granite-gray leading-none text-xs mt-2">Pay with Paystack Checkout</p>
                </label>
            </div>

            <Button class="text-white bg-black w-full border-0 py-3 mt-4" @click="handleCheckout">
                <div role="status" v-if="isPending">
                    <Spinner />
                </div>
                <span v-else>Continue</span>
            </Button>
        </Drawer>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Minus, Plus } from "lucide-vue-next";
import { useOrderStore } from "../stores/order";
import { useStoreInfo } from "../stores/storeInfo";
import { useCartStore } from "../stores/cart";
import { useApiCalls } from "../composables/useApiCalls";
import { useUtils } from "../composables/useUtils";
import Spinner from "../components/utils/Spinner.vue";
import SummaryItem from "../components/order-summary/SummaryItem.vue";
import ShippingSummary from "../components/order-summary/ShippingSummary.vue";
import SummaryTotal from "../components/order-summary/SummaryTotal.vue";
import { useRoute } from "vue-router";
import Drawer from "primevue/drawer";
import { useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const storeSlug = route.params.storeSlug;
const eventSlug = route.params.eventSlug;

const { shippingDetails } = useOrderStore();
const { cart, cartLength, cartTotal } = useCartStore();
const { storeInfo } = useStoreInfo();
const { createOrder } = useApiCalls();
const { trimmedString } = useUtils();
const visibleBottom = ref(false);
const paymentMethod = ref("Offline");
const { mutate: useCreateOrder, isPending, error } = createOrder();

watch(paymentMethod, (newValue) => {
    console.log("Payment method changed to:", newValue);
});

const totalAmount = computed(() => {
    return Number(cartTotal).toLocaleString();
});

const totalProducts = computed(() => cart.reduce((sum, item) => sum + item.selected_quantity, 0));

const uniqueProductCount = () => {
    const uniqueIds = new Set(cart.map((item) => item.id));
    return uniqueIds.size;
};

const generateOrderRef = (storeId, cartItems) => {
    const refType = "1";
    const randInt = Math.floor(Math.random() * 9000) + 1000; // ensures it's 4-digit
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const cartCount = cartItems.length.toString().padStart(2, "0");
    const paddedStoreId = storeId.toString().padStart(4, "0");

    return `${refType}${paddedStoreId}${month}${day}${cartCount}${year}${randInt}`;
};
const variantNames = (product) => {
    const names = product.variants.split(",").filter(Boolean);
    return names.length ? names : ["", "", ""];
};

const orderRef = generateOrderRef(storeInfo.event.store.id, cart);
const orderDate = new Date().toISOString().split("T")[0];

const payloadItems = cart.map((item, i) => {
    const variants = variantNames(item);
    const payloadItem = {
        has_feedback: false,
        index: i,
        lead_time: 5,
        note: "",
        product: item.id,
        productid: item.id,
        sku: item.selected_sku,
        qty: item.selected_quantity,
        price_sold: item.variant_price || item.price,
        status: 1,
        sub_total: item.itemTotal,
        selected_position: i + 1,
        is_returned: false,
    };

    // Dynamically add varXname and selected_optionX
    variants.forEach((variantName, index) => {
        payloadItem[`var${index + 1}name`] = variantName;
        payloadItem[`selected_option${index + 1}`] = item[`selected_variant${index + 1}`];
    });

    return payloadItem;
});

const customerInfo = computed(() => {
    const { firstName, phoneNumber, email, address, lastName, location } = shippingDetails;
    if (!firstName && !phoneNumber && !email) {
        return null;
    }
    return {
        address,
        email,
        first_name: firstName,
        last_name: lastName,
        line1: address,
        phone: phoneNumber,
        city: location,
    };
});

const handleCheckout = () => {
    visibleBottom.value = false;
    const payload = {
        channel: 3,
        customer_info: customerInfo.value,
        fulfilled: 0,
        has_customer: false,    
        items_count: cartLength,
        order_ref: orderRef,
        order_date: orderDate,
        paid_amount: 0,
        payment_mode: 1,
        payment_status: 0,
        products_total: Number(totalAmount.value.replace(/,/g, '')),
        shipping_price: 0,
        shipping_company: 0,
        shipping_mode: false,
        shipping_paid: false,
        store: storeInfo.event.store.id,
        total_amount: Number(totalAmount.value.replace(/,/g, '')),
        unique_items: uniqueProductCount(),
        items: [...payloadItems],
        redirect_url: `${window.location.origin}/${storeSlug}/events/${eventSlug}/store/order-successful/${orderRef.slice(-6)}`,
        event: storeInfo.event.id,
        payment_provider: paymentMethod.value === "Online" ? "paystack" : "cash",
    };

    console.log(payload);
    useCreateOrder(payload, {
        onSuccess: async (res) => {
            queryClient.refetchQueries({ queryKey: ["storeInfo"] });
            console.log(paymentMethod.value, res.data);

            if (paymentMethod.value === "Online") {
                window.location.href = `https://checkout.paystack.com/${res.data.access_code}`;
            } else {
                console.log("Offline order created successfully", res.data);
                router.push({
                    name: "OrderSuccessful",
                    params: { id: res.data.order_ref.slice(-6) },
                });
            }
        },
    });
};
</script>

<style>
button.p-drawer-close-button {
    display: none !important;
}

.p-drawer-title {
    color: #000 !important;
    font-size: 1.1rem !important;
}
</style>
