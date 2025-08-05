<template>
    <div class="flex flex-col min-h-screen p-4 z-50 fixed top-0 left-0 right-0 bg-white">
        <div class="flex-1 flex flex-col items-center justify-center p-4">
            <div class="relative top-12 flex flex-col items-center justify-center">
                <img
                    :src="storeInfo.store_logo ? storeInfo.store_logo : fallbackLogo"
                    alt="logo"
                    :class="storeInfo.store_logo ? 'h-10 mb-6' : 'h-5 mb-2'"
                />
                <Calendar class="w-32 h-32 mb-6 -z-10" />
            </div>
            <h6 class="mb-4 text-center z-10">This popup has ended</h6>
            <p class="text-granite-gray mb-6 text-center">
                But no worries you can still shop from our regular store and explore more amazing products.
            </p>

            <Button type="submit" severity="secondary" label="Visit our website" class="bg-black text-white py-3 w-full" @click="visitWebsite" />
        </div>

        <div class="rounded-md bg-anti-flash-white text-granite-gray p-4 text-center">
            <p>
                Get your own website
                <a
                    href="http://www.leyyow.com/auth/signup"
                    class="text-spanish-viridian underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    >here</a
                >
            </p>
            <div class="text-xs flex items-center justify-center mt-2 gap-1">
                <p class="text-metallic-silver">Powered by</p>
                <img src="../../assets/images/pngs/leyyow-logo.png" alt="leyyow logo" class="inline h-4" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { useStoreInfo } from "../../stores/storeInfo";
import fallbackLogo from "../../assets/images/pngs/leyyow-logo.png";
import { ref } from "vue";
import { getCurrentStoreSlug } from "../../includes/utils";
import Calendar from "../../assets/icons/calendar.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const showModal = ref(false);
const handleNotify = () => {
    showModal.value = true;
    console.log("Notify me form submitted");
};

const visitWebsite = () => {
    window.open(`https://shop.leyyow.com/${route.params.storeSlug}`, "_blank");
};
const { storeInfo } = useStoreInfo();
</script>
