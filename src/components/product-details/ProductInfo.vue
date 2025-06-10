<script setup>
import { defineProps, computed, defineEmits } from "vue";
import { useUtils } from "../../composables/useUtils";

const { formatPrice } = useUtils();

const props = defineProps({
    filteredProduct: {
        type: Object,
        required: true,
    },
    price: {
        type: Function,
        required: true,
    },
    hasVariants: {
        type: Boolean,
        default: false,
    },
    stockLeft: {
        type: Number,
    },
    showStock: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["share-clicked"]);

const formattedPrice = computed(() => (props.filteredProduct.price / 100).toLocaleString());

const handleShareClick = () => {
    emit("share-clicked", props.filteredProduct.id); // Optionally pass product data
};
</script>

<template>
    <div>
        <div class="flex py-3 justify-between items-center">
            <h5 class="font-normal max-w-[80%]">{{ filteredProduct.product_name }}</h5>
            <div>
                <button
                    class="rounded-full w-10 h-10 border-platinum border flex justify-center items-center cursor-pointer"
                    @click="handleShareClick"
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        class="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            opacity="0.4"
                            d="M12.1428 1.5H5.86532C3.13532 1.5 1.50781 3.1275 1.50781 5.8575V12.135C1.50781 14.865 3.13532 16.4925 5.86532 16.4925H12.1428C14.8728 16.4925 16.5003 14.865 16.5003 12.135V5.8575C16.5003 3.1275 14.8728 1.5 12.1428 1.5Z"
                            fill="#000002"
                        />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.60225 4.48458C8.82192 4.26491 9.17808 4.26491 9.39775 4.48458L11.6477 6.73458C11.8674 6.95425 11.8674 7.3104 11.6477 7.53007C11.4281 7.74974 11.0719 7.74974 10.8523 7.53007L9 5.67782L7.14775 7.53007C6.92808 7.74974 6.57192 7.74974 6.35225 7.53007C6.13258 7.3104 6.13258 6.95425 6.35225 6.73458L8.60225 4.48458Z"
                            fill="#000002"
                        />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M9 4.31982C9.31066 4.31982 9.5625 4.57166 9.5625 4.88232V10.8823C9.5625 11.193 9.31066 11.4448 9 11.4448C8.68934 11.4448 8.4375 11.193 8.4375 10.8823V4.88232C8.4375 4.57166 8.68934 4.31982 9 4.31982Z"
                            fill="#000002"
                        />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.96666 12.2042C4.06512 11.9095 4.3838 11.7505 4.67844 11.849C7.48023 12.7853 10.5201 12.7853 13.3219 11.849C13.6165 11.7505 13.9352 11.9095 14.0336 12.2042C14.1321 12.4988 13.9731 12.8175 13.6784 12.916C10.6452 13.9296 7.35508 13.9296 4.32186 12.916C4.02722 12.8175 3.86819 12.4988 3.96666 12.2042Z"
                            fill="#000002"
                        />
                    </svg>
                </button>
            </div>
        </div>

        <div class="flex gap-2 items-center justify-between">
            <h5>
                <span v-if="hasVariants" class="text-sm me-1">from </span>
                <span v-html="formatPrice(props.price(props.filteredProduct))"></span>
            </h5>

            <!-- out of stock  -->
            <div
                class="px-1.5 py-0.5 text-white bg-orioles-orange rounded-sm w-auto flex justify-center items-center"
                v-if="stockLeft === 0 && showStock"
            >
                <small>Out of stock</small>
            </div>

            <!-- low in stock  -->
            <div
                class="px-1.5 py-0.5 text-white bg-vivid-gamboge rounded-sm w-auto flex justify-center items-center"
                v-else-if="stockLeft <= 5 && showStock"
            >
                <small>Low in stock</small>
            </div>
        </div>
    </div>
</template>
