<template>
    <div class="flex flex-col h-dvh w-full overflow-y-hidden">
        <div class="flex-1 overflow-y-auto px-4 py-2 mt-3">
            <CartPageItem v-for="item in cart" :key="item.id" :item="item" />
        </div>

        <div class="h-43 shadow-[0px_-4px_8px_0px_#00000014] p-4">
            <div class="flex justify-between mb-3">
                <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    class="rounded-md w-[75%] bg-anti-flash-white placeholder:text-manatee text-manatee p-3 focus:outline-manatee"
                />
                <button class="w-[23%] bg-black text-white py-3 rounded-md">Apply</button>
            </div>
            <div class="flex justify-between pb-3 border-b border-platinum">
                <p class="text-granite-gray">
                    SubTotal ({{ totalProducts ? totalProducts : 0 }} item<span v-if="totalProducts > 0">s</span>):
                </p>
                <p v-html="formatPrice(totalAmount)"></p>
            </div>
            <div class="flex justify-between py-3">
                <router-link
                    :to="{ name: 'Store', params: { storeSlug: storeSlug, eventSlug: eventSlug, eventId: eventId } }"
                    class="w-[35%]"
                >
                    <button class="w-full bg-anti-flash-white text-black py-3 rounded-md">Back to Shop</button>
                </router-link>
                <button class="w-[63%] bg-black text-white py-3 rounded-md" @click="proceedToShipping">
                    Proceed to Shipping
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, watch } from "vue";
import { useCartStore } from "../stores/cart";
import CartPageItem from "../components/CartPageItem.vue";
import { useRouter } from "vue-router";
import { useQueryClient } from "@tanstack/vue-query";
import { useUtils } from "../composables/useUtils";
import { useRoute } from "vue-router";

const queryClient = useQueryClient();
const { formatPrice } = useUtils();

onMounted(() => {
    queryClient.invalidateQueries({ queryKey: ["storeInfo"] });
});

const router = useRouter();
const route = useRoute();
const storeSlug = route.params.storeSlug;
const eventSlug = route.params.eventSlug;
const eventId = route.params.eventId;
const { cart, cartLength } = useCartStore();

const proceedToShipping = () => {
    if (cart.length !== 0) {
        router.push({ name: "ShippingDetails", params: { storeSlug: storeSlug, eventSlug: eventSlug, eventId: eventId } });
    }
};

const totalAmount = computed(() => cart.reduce((sum, item) => sum + item.variant_price * item.selected_quantity, 0));
const totalProducts = computed(() => cart.reduce((sum, item) => sum + item.selected_quantity, 0));

watch(
    () => totalProducts.value,
    (newLength) => {
        if (newLength === 0) {
            router.push({ name: "Store", params: { storeSlug: storeSlug, eventSlug: eventSlug, eventId: eventId } });
        }
    },
);
</script>
<style></style>
