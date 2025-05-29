<template>
    <div class="flex gap-2 mb-5">
        <Toast class="w-8/9 flex items-center" :visible="error" />

        <div class="w-24 h-24 min-h-full">
            <img
                :src="item.images[0].image"
                alt="product image"
                class="w-full h-full object-cover rounded-sm bg-granite-gray"
                v-if="item.images.length"
            />
            <ProductImagePlaceholder v-else />
        </div>

        <div class="flex flex-col gap-2 flex-1 justify-between">
            <div class="flex gap-1.5">
                <div class="w-[65%]">
                    <p v-if="trimmedString(item.product_name)">{{ trimmedString(item.product_name) }}...</p>
                    <p v-else>{{ item.product_name }}</p>

                    <p class="text-granite-gray pt-1">
                        <span v-if="item.selected_variant1">{{ item.selected_variant1 }}</span
                        ><span v-if="item.selected_variant2">, {{ item.selected_variant2 }}</span>
                        <span v-if="item.selected_variant3">, {{ item.selected_variant3 }}</span>
                    </p>
                </div>
                <div class="w-[33%] font-bold flex justify-end items-start">
                    <p v-html="formatPrice(item.variant_price * item.selected_quantity)"></p>
                </div>
            </div>
            <div class="flex justify-between items-center">
                <div class="flex gap-1 items-center">
                    <button
                        class="text-feldgrau bg-granite-gray/50 w-6 h-6 flex justify-center items-center rounded-sm cursor-pointer"
                        @click="decreaseQuantity(item)"
                    >
                        <Minus class="w-4 h-4" />
                    </button>
                    <div
                        class="h-8.5 min-w-8.5 px-2 py-1 bg-anti-flash-white text-black rounded-sm border-0 flex items-center justify-center"
                        @click="quantityPopupIsOpen = true"
                    >
                        <p>{{ item.selected_quantity }}</p>
                        <Dialog v-model:visible="quantityPopupIsOpen" modal header="Enter quantity" class="w-11/12">
                            <Form
                                v-slot="$form"
                                :initialValues
                                :resolver
                                @submit="onFormSubmit"
                                class="flex flex-col gap-4 w-full sm:w-56"
                            >
                                <p>In Stock: {{ item.variant_total_stock }}</p>
                                <div class="flex flex-col gap-1">
                                    <InputNumber
                                        name="quantity"
                                        type="number"
                                        class="w-full text-center"
                                        fluid
                                        :min="0"
                                    />
                                    <Message
                                        v-if="$form.quantity?.invalid"
                                        severity="error"
                                        size="small"
                                        variant="simple"
                                        >{{ $form.quantity.error?.message }}</Message
                                    >
                                </div>
                                <Button
                                    type="submit"
                                    severity="secondary"
                                    label="Submit"
                                    class="bg-black text-white py-3"
                                />
                            </Form>
                        </Dialog>
                    </div>
                    <button
                        type="button"
                        class="text-feldgrau bg-granite-gray/50 w-6 h-6 flex justify-center items-center rounded-sm cursor-pointer"
                        @click="increaseQuantity(item)"
                    >
                        <Plus class="w-4 h-4" />
                    </button>
                </div>

                <button class="cursor-pointer" @click="visible = true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.5574 4.35817C16.2157 4.22484 14.8741 4.12484 13.5241 4.04984V4.0415L13.3407 2.95817C13.2157 2.1915 13.0324 1.0415 11.0824 1.0415H8.89907C6.95741 1.0415 6.77407 2.1415 6.64074 2.94984L6.46574 4.0165C5.69074 4.0665 4.91574 4.1165 4.14074 4.1915L2.44074 4.35817C2.09074 4.3915 1.84074 4.69984 1.87407 5.0415C1.90741 5.38317 2.20741 5.63317 2.55741 5.59984L4.25741 5.43317C8.62407 4.99984 13.0241 5.1665 17.4407 5.60817C17.4657 5.60817 17.4824 5.60817 17.5074 5.60817C17.8241 5.60817 18.0991 5.3665 18.1324 5.0415C18.1574 4.69984 17.9074 4.3915 17.5574 4.35817Z"
                            fill="url(#paint0_linear_9307_13553)"
                        />
                        <path
                            opacity="0.3991"
                            d="M16.0245 6.7835C15.8245 6.57516 15.5495 6.4585 15.2661 6.4585H4.7328C4.44947 6.4585 4.16613 6.57516 3.97447 6.7835C3.7828 6.99183 3.67447 7.27516 3.69113 7.56683L4.2078 16.1168C4.29947 17.3835 4.41613 18.9668 7.32447 18.9668H12.6745C15.5828 18.9668 15.6995 17.3918 15.7911 16.1168L16.3078 7.57516C16.3245 7.27516 16.2161 6.99183 16.0245 6.7835Z"
                            fill="url(#paint1_linear_9307_13553)"
                        />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.98242 14.1665C7.98242 13.8213 8.26224 13.5415 8.60742 13.5415H11.3824C11.7276 13.5415 12.0074 13.8213 12.0074 14.1665C12.0074 14.5117 11.7276 14.7915 11.3824 14.7915H8.60742C8.26224 14.7915 7.98242 14.5117 7.98242 14.1665Z"
                            fill="url(#paint2_linear_9307_13553)"
                        />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.29102 10.8335C7.29102 10.4883 7.57084 10.2085 7.91602 10.2085H12.0827C12.4279 10.2085 12.7077 10.4883 12.7077 10.8335C12.7077 11.1787 12.4279 11.4585 12.0827 11.4585H7.91602C7.57084 11.4585 7.29102 11.1787 7.29102 10.8335Z"
                            fill="url(#paint3_linear_9307_13553)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_9307_13553"
                                x1="10.0026"
                                y1="1.0415"
                                x2="10.0026"
                                y2="5.60817"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#EA291E" />
                                <stop offset="1" stop-color="#CD1C13" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_9307_13553"
                                x1="9.99947"
                                y1="6.4585"
                                x2="9.99947"
                                y2="18.9668"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#EA291E" />
                                <stop offset="1" stop-color="#CD1C13" />
                            </linearGradient>
                            <linearGradient
                                id="paint2_linear_9307_13553"
                                x1="9.99492"
                                y1="13.5415"
                                x2="9.99492"
                                y2="14.7915"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#EA291E" />
                                <stop offset="1" stop-color="#CD1C13" />
                            </linearGradient>
                            <linearGradient
                                id="paint3_linear_9307_13553"
                                x1="9.99935"
                                y1="10.2085"
                                x2="9.99935"
                                y2="11.4585"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#EA291E" />
                                <stop offset="1" stop-color="#CD1C13" />
                            </linearGradient>
                        </defs>
                    </svg>
                </button>
                <Dialog v-model:visible="visible" modal header="Confirm Removal" :style="{ width: '80%' }">
                    <p>Are you sure you want to remove this item from your cart?</p>

                    <div class="flex gap-2 mt-4">
                        <button class="w-full py-2 bg-black text-white rounded-sm" @click="visible = false">
                            cancel
                        </button>
                        <button
                            class="w-full py-2 bg-lava text-white rounded-sm"
                            @click="
                                () => {
                                    removeSelection(item);
                                    visible = false;
                                }
                            "
                        >
                            remove
                        </button>
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, watch, reactive } from "vue";
import { Minus, Plus } from "lucide-vue-next";
import { useCartStore } from "../stores/cart";
import { useToast } from "primevue/usetoast";
import { useUtils } from "../composables/useUtils";
import ProductImagePlaceholder from "./common/ProductImagePlaceholder.vue";

const props = defineProps({
    item: Object,
});

const toast = useToast();
const error = ref(false);
const quantityPopupIsOpen = ref(false);
const visible = ref(false);
const {
    cart,
    cartTotal,
    cartLength,
    increaseSelectionQuantity,
    decreaseSelectionQuantity,
    removeSelection,
    updateSelectionQuantity,
} = useCartStore();
const { trimmedString, formatPrice } = useUtils();

const increaseQuantity = (cartItem) => {
    increaseSelectionQuantity(cartItem);
    if (cartItem.variant_total_stock === cartItem.selected_quantity) {
        error.value = true;
        toast.add({ severity: "info", detail: "All available stock are in your cart", life: 1000 });
    }
};

const decreaseQuantity = (cartItem) => {
    decreaseSelectionQuantity(cartItem);
    if (cartItem.selected_quantity === 1) {
        error.value = true;
        toast.add({ severity: "info", detail: "Use the delete button to remove an Item from the cart", life: 1000 });
    }
};

const initialValues = reactive({
    quantity: props.item.selected_quantity,
});

const resolver = ({ values }) => {
    const errors = {};

    if (values.quantity > props.item.variant_total_stock) {
        errors.quantity = [{ message: "Not enough stock available" }];
    }

    if (values.quantity === 0) {
        errors.quantity = [{ message: "Please enter a valid quantity" }];
    }

    return {
        values,
        errors,
    };
};

const onFormSubmit = ({ valid, values }) => {
    if (valid) {
        updateSelectionQuantity(props.item, values.quantity);
        quantityPopupIsOpen.value = false;
        initialValues.quantity = values.quantity;
    }
};
</script>
