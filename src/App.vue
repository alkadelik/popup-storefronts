<template>
    <div class="font-aeonik h-screen flex justify-center items-center">
        <div class="md:w-lg lg:w-sm w-full h-full max-h-screen overflow-y-auto scrollbar-hide">
            <div v-if="isLoading">
                <StoreHomeSkeleton />
            </div>
            <RouterView v-else />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useStoreInfo } from "./stores/storeInfo.ts";
import { useApiCalls } from "./composables/useApiCalls.ts";
import { useRoute, useRouter } from "vue-router";
import StoreHomeSkeleton from "./components/skeletons/StoreHomeSkeleton.vue";
import { useQuery } from "@tanstack/vue-query";

const { storeInfo, updateStoreInfo } = useStoreInfo();
const { fetchStoreInfoQueryFn } = useApiCalls();
const route = useRoute();
const router = useRouter();
sessionStorage.clear();

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
            router.push({ name: "NotFound" });
        }
    },
);

// watch(
//     () => route.params,
//     (params) => {
//         if (params.storeSlug !== undefined || params.eventSlug !== undefined) {
//             storeQuery.refetch(params);
//         }
//     },
// );

const isLoading = computed(() => storeQuery.isLoading.value);
const routeName = computed(() => route.name);
</script>
