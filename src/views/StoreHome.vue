<template>
    <div class="store-home pb-4">
        <ToastSuccess :visible="(visible = 'success')" @close="visible = false" :text="toastText" />

        <div class="py-6 px-4 flex gap-4 items-center" v-if="storeInfo?.event?.store">
            <div class="h-16 w-16 rounded-md">
                <img :src="storeInfo.event.store.logo" alt="store logo" class="h-full w-full object-cover rounded-md" />
            </div>

            <div class="h-16 flex flex-col justify-between py-1">
                <h6 class="text-dark-slate-gray">{{ storeInfo.event.store.store_name }}</h6>
                <div class="flex gap-1.5 items-center" v-if="storeInfo.event.store.phone1">
                    <p class="text-xanadu">{{ storeInfo.event.store.phone1 }}</p>
                    <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 14 14" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-4 w-4 cursor-pointer"
                        @click="copyToClipboard(storeInfo.event.store.phone1)"
                    >
                        <path
                            d="M9.33317 7.525V9.97501C9.33317 12.0167 8.5165 12.8333 6.47484 12.8333H4.02484C1.98317 12.8333 1.1665 12.0167 1.1665 9.97501V7.525C1.1665 5.48334 1.98317 4.66667 4.02484 4.66667H6.47484C8.5165 4.66667 9.33317 5.48334 9.33317 7.525Z"
                            fill="#92AAA3"
                        />
                        <path
                            opacity="0.4"
                            d="M9.97486 1.16667H7.52486C5.51236 1.16667 4.6957 1.96584 4.67236 3.9375H6.47486C8.92486 3.9375 10.0624 5.075 10.0624 7.525V9.3275C12.034 9.30417 12.8332 8.4875 12.8332 6.475V4.025C12.8332 1.98334 12.0165 1.16667 9.97486 1.16667Z"
                            fill="#92AAA3"
                        />
                    </svg>
                </div>
            </div>
        </div>

        <div class="pb-4 px-4 flex justify-between items-center">
            <div class="w-[70%] relative">
                <input
                    type="text"
                    placeholder="Search for by name"
                    v-model="productStore.searchInput"
                    class="bg-anti-flash-white text-dark-green placeholder:text-manatee rounded-sm w-full ps-8 pe-1.5 py-2.5 focus:outline-manatee"
                />
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    class="absolute top-2 left-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        opacity="0.4"
                        d="M7.66634 14.0002C11.1641 14.0002 13.9997 11.1646 13.9997 7.66683C13.9997 4.16903 11.1641 1.3335 7.66634 1.3335C4.16854 1.3335 1.33301 4.16903 1.33301 7.66683C1.33301 11.1646 4.16854 14.0002 7.66634 14.0002Z"
                        fill="#97A1AC"
                    />
                    <path
                        d="M14.1997 14.6669C14.0797 14.6669 13.9597 14.6202 13.873 14.5335L12.633 13.2935C12.453 13.1135 12.453 12.8202 12.633 12.6335C12.813 12.4535 13.1064 12.4535 13.293 12.6335L14.533 13.8735C14.713 14.0535 14.713 14.3469 14.533 14.5335C14.4397 14.6202 14.3197 14.6669 14.1997 14.6669Z"
                        fill="#97A1AC"
                    />
                </svg>
            </div>

            <!-- filter button  -->
            <div class="w-10 h-10">
                <button
                    class="bg-anti-flash-white rounded-sm w-full h-full flex items-center justify-center cursor-pointer"
                    @click="sortIsOpen = true"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-7 w-7"
                    >
                        <path
                            opacity="0.4"
                            d="M10.793 1.3335H5.20634C2.77967 1.3335 1.33301 2.78016 1.33301 5.20683V10.7868C1.33301 13.2202 2.77967 14.6668 5.20634 14.6668H10.7863C13.213 14.6668 14.6597 13.2202 14.6597 10.7935V5.20683C14.6663 2.78016 13.2197 1.3335 10.793 1.3335Z"
                            fill="#445B54"
                        />
                        <path
                            d="M12 5.6665H4C3.72667 5.6665 3.5 5.43984 3.5 5.1665C3.5 4.89317 3.72667 4.6665 4 4.6665H12C12.2733 4.6665 12.5 4.89317 12.5 5.1665C12.5 5.43984 12.2733 5.6665 12 5.6665Z"
                            fill="#445B54"
                        />
                        <path
                            d="M10.6663 8.5H5.33301C5.05967 8.5 4.83301 8.27333 4.83301 8C4.83301 7.72667 5.05967 7.5 5.33301 7.5H10.6663C10.9397 7.5 11.1663 7.72667 11.1663 8C11.1663 8.27333 10.9397 8.5 10.6663 8.5Z"
                            fill="#445B54"
                        />
                        <path
                            d="M8.88645 11.3335H7.10645C6.83311 11.3335 6.60645 11.1068 6.60645 10.8335C6.60645 10.5602 6.83311 10.3335 7.10645 10.3335H8.88645C9.15978 10.3335 9.38645 10.5602 9.38645 10.8335C9.38645 11.1068 9.16645 11.3335 8.88645 11.3335Z"
                            fill="#445B54"
                        />
                    </svg>
                </button>

                <Dialog v-model:visible="sortIsOpen" modal header="Sorting by" class="w-11/12">
                    <SortPopup @closePopup="sortIsOpen = false" />
                </Dialog>
            </div>

            <!-- cart  -->
            <div class="w-10 h-10">
                <router-link :to="{ name: 'Cart', params: { slug: currentSlug } }">
                    <button
                        class="bg-anti-flash-white rounded-sm w-full h-full flex items-center justify-center cursor-pointer relative"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-7 w-7"
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
                        <div
                            class="py-1 px-1.5 bg-lava flex items-center justify-center rounded-sm text-white absolute top-1 right-1"
                            v-if="totalProducts"
                        >
                            <small class="smaller">{{ totalProducts }}</small>
                        </div>
                    </button>
                </router-link>
            </div>
        </div>

        <section class="px-4">
            <div class="flex flex-wrap gap-1">
                <ProductCard v-for="product in productStore.filteredProducts" :key="product.id" :product="product" />
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStoreInfo } from "../stores/storeInfo";
import ProductCard from "../components/ProductCard.vue";
import { useProductStore } from "../stores/product";
import { useCartStore } from "../stores/cart";
import SortPopup from "../components/SortPopup.vue";
import { useRoute } from "vue-router";
import ToastSuccess from "../components/utils/ToastSuccess.vue";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const currentSlug = route.params.slug;
const sortIsOpen = ref(false);
const { storeInfo } = useStoreInfo();
const productStore = useProductStore();
const cartStore = useCartStore();
const toast = useToast();
const toastText = ref("");
const visible = ref(false);

const totalProducts = computed(() => cartStore.cart.reduce((sum, item) => sum + item.selected_quantity, 0));

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        toastText.value = "Copied to clipboard!";
        toast.add({
            severity: "custom",
            life: 2000,
            group: "headless",
            styleClass: "w-full",
        });
        visible.value = "success";
    })
};
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
    display: none; /* Hide scrollbar */
}

.scrollbar-hide {
    -ms-overflow-style: none; /* Hide scrollbar for IE & Edge */
    scrollbar-width: none; /* Hide scrollbar for Firefox */
}
</style>
