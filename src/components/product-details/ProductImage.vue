<template>
    <div class="w-full h-100 rounded-lg">
        <img
            :src="props.filteredProduct.images[0].image"
            alt="product image"
            class="w-full h-full object-cover rounded-sm bg-granite-gray"
            v-if="props.filteredProduct.images.length"
        />
        <ProductImagePlaceholder v-else />
    </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import ProductImagePlaceholder from "../common/ProductImagePlaceholder.vue";

const props = defineProps({
    filteredProduct: {
        type: Object,
        required: true,
    },
});
</script>
