<template>
    <div class="font-sato h-screen flex justify-center items-center">
        <div class="md:w-lg lg:w-sm w-full h-full max-h-screen overflow-y-auto scrollbar-hide">
            <div v-if="isLoading">
                <StoreHomeSkeleton />
            </div>
            <EventClosed v-if="showEventClosed" />
            <template v-else>
                <RouterView v-if="!isLoading && !showNotFound" />
                <NotFoundScreen v-if="showNotFound" />
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useStoreInfo } from "./stores/storeInfo.ts";
import { useApiCalls } from "./composables/useApiCalls.ts";
import { useRoute } from "vue-router";
import StoreHomeSkeleton from "./components/skeletons/StoreHomeSkeleton.vue";
import { useQuery } from "@tanstack/vue-query";
import { useCartStore } from "./stores/cart.ts";
import { useGlobalStore } from "./stores/global.ts";
import NotFoundScreen from "./components/common/404Screen.vue";
import EventClosed from "./components/common/EventClosed.vue";

const { storeInfo, updateStoreInfo } = useStoreInfo();
const { fetchStoreInfoQueryFn } = useApiCalls();
const globalStore = useGlobalStore();
const showEventClosed = computed(() => globalStore.showEventClosed);
const showNotFound = computed(() => globalStore.showNotFound);
const cartStore = useCartStore();
const route = useRoute();

const storeQuery = useQuery({
    queryKey: ["storeInfo", route.params],
    queryFn: () => fetchStoreInfoQueryFn(route.params),
    enabled: computed(() => !!route.params.storeSlug && !!route.params.eventSlug),
    refetchOnWindowFocus: false,
});

watch(
    () => storeQuery.isError.value,
    (isError) => {
        if (isError) {
            console.error("Fetch store info failed.");
            sessionStorage.clear();
            globalStore.setShowNotFound(true);
        }
    },
);

watch(
    () => showEventClosed,
    (val) => {
        console.log(val ? "Event is closed" : "Event is open");
        
    },
);

const isLoading = computed(() => storeQuery.isLoading.value);
const routeName = computed(() => route.name);
</script>
