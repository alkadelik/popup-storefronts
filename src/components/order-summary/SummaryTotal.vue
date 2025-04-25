<template>
    <div class="h-35 shadow-[0px_-4px_8px_0px_#00000014] px-4 py-2.5">
        <div class="flex justify-between pb-1.5">
            <p class="text-granite-gray">SubTotal ({{ totalProducts }} item<span v-if="totalProducts > 0">s</span>):</p>
            <p v-html="formatPrice(cartTotal)"></p>
        </div>

        <div class="flex justify-between pt-2 font-bold">
            <p class="text-granite-gray">Total Amount:</p>
            <p class="text-feldgrau" v-html="formatNaira(totalAmount)"></p>
        </div>

        <div class="flex justify-between py-3">
            <router-link :to="{ name: 'Store', params: { slug: currentSlug } }" class="w-[35%]">
                <button class="w-full bg-anti-flash-white text-black py-3 rounded-md">Back to Shop</button>
            </router-link>
            <button
                class="w-[63%] bg-black text-white py-3 rounded-md cursor-pointer"
                :disabled="isPending"
                @click="$emit('checkout')"
            >
                <div role="status" v-if="isPending">
                    <Spinner />
                </div>
                <span v-else>Proceed to Checkout</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useUtils } from "../../composables/useUtils";
import { useRoute } from "vue-router";

const route = useRoute();
const currentSlug = route.params.slug;
const { formatPrice, formatNaira } = useUtils();
defineProps({
    totalProducts: Number,
    cartTotal: Number,
    deliveryFee: Number,
    totalAmount: String,
    isPending: Boolean,
});

defineEmits(["checkout"]);
</script>
