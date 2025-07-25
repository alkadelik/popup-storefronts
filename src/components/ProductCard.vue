<script setup>
import { RouterLink } from "vue-router";
import { useProductStore } from "../stores/product";
import { useCartStore } from "../stores/cart";
import { useUtils } from "../composables/useUtils";
import { useRoute } from "vue-router";
import ProductImagePlaceholder from "./common/ProductImagePlaceholder.vue";

const route = useRoute();
const storeSlug = route.params.storeSlug;
const eventSlug = route.params.eventSlug;
const { isProductInCart } = useCartStore();
const { formatPricetoK } = useUtils();
const productStore = useProductStore();

defineProps({
    product: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <RouterLink
        :to="{ name: 'ProductDetail', params: { storeSlug: storeSlug, eventSlug: eventSlug }, hash: `#${product.id}` }"
        class="w-[32.5%] h-32 mb-0.5 rounded-sm relative"
    >
        <img
            :src="product.images[0].image"
            alt="product image"
            class="w-full h-full object-cover rounded-sm bg-granite-gray"
            v-if="product.images.length"
        />
        <ProductImagePlaceholder v-else />

        <!-- out of stock  -->
        <div
            class="px-1.5 py-0.5 text-white bg-orioles-orange rounded-sm z-5 absolute top-1 right-1 w-auto flex justify-center items-center"
            v-if="product.total_stock === 0"
        >
            <small>Out of stock</small>
        </div>

        <!-- low in stock  -->
        <div
            class="px-1.5 py-0.5 text-white bg-vivid-gamboge rounded-sm z-5 absolute top-1 right-1 w-auto flex justify-center items-center"
            v-else-if="product.total_stock <= 5"
        >
            <small>{{ product.total_stock }} in stock</small>
        </div>

        <!-- if product is in cart  -->
        <div
            :class="[
                'w-7 h-7 rounded-sm absolute right-1 flex items-center justify-center bg-bright-gray',
                product.total_stock > 0 && product.total_stock <= 5 ? 'top-5.5' : 'top-1',
            ]"
            v-if="isProductInCart(product)"
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4.5 w-4.5"
            >
                <path
                    opacity="0.4"
                    d="M12.8263 3.71988H12.5597L10.3063 1.46654C10.1263 1.28654 9.83301 1.28654 9.64634 1.46654C9.46634 1.64654 9.46634 1.93988 9.64634 2.12654L11.2397 3.71988H4.75967L6.35301 2.12654C6.53301 1.94654 6.53301 1.65321 6.35301 1.46654C6.17301 1.28654 5.87967 1.28654 5.69301 1.46654L3.44634 3.71988H3.17967C2.57967 3.71988 1.33301 3.71988 1.33301 5.42654C1.33301 6.07321 1.46634 6.49988 1.74634 6.77988C1.90634 6.94654 2.09967 7.03321 2.30634 7.07988C2.49967 7.12654 2.70634 7.13321 2.90634 7.13321H13.093C13.2997 7.13321 13.493 7.11988 13.6797 7.07988C14.2397 6.94654 14.6663 6.54654 14.6663 5.42654C14.6663 3.71988 13.4197 3.71988 12.8263 3.71988Z"
                    fill="#445B54"
                />
                <path
                    d="M13.1 7.13341H2.90664C2.70664 7.13341 2.49997 7.12674 2.30664 7.08008L3.14664 12.2001C3.33331 13.3467 3.83331 14.6667 6.05331 14.6667H9.79331C12.04 14.6667 12.44 13.5401 12.68 12.2801L13.6866 7.08008C13.5 7.12008 13.3 7.13341 13.1 7.13341ZM7.07331 11.4401C7.07331 11.7001 6.86664 11.9067 6.60664 11.9067C6.34664 11.9067 6.13997 11.7001 6.13997 11.4401V9.24008C6.13997 8.98008 6.34664 8.77341 6.60664 8.77341C6.86664 8.77341 7.07331 8.98008 7.07331 9.24008V11.4401ZM9.92664 11.4401C9.92664 11.7001 9.71997 11.9067 9.45997 11.9067C9.19997 11.9067 8.99331 11.7001 8.99331 11.4401V9.24008C8.99331 8.98008 9.19997 8.77341 9.45997 8.77341C9.71997 8.77341 9.92664 8.98008 9.92664 9.24008V11.4401Z"
                    fill="#445B54"
                />
            </svg>
        </div>

        <!-- Price -->
        <div class="w-full relative bottom-8 z-5 h-6 p-1">
            <p class="bg-white w-full text-center rounded-sm">
                <small v-if="product.variants && product.variants.length">from </small>
                <span v-html="formatPricetoK(product.price)"></span>
            </p>
        </div>
    </RouterLink>
</template>
