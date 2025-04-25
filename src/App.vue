<template>
    <div class="font-aeonik h-screen flex justify-center items-center">
        <div class="md:w-lg lg:w-sm w-full h-full max-h-screen overflow-y-auto scrollbar-hide">
            <div v-if="isLoading">
                <StoreHomeSkeleton />
            </div>
            <router-view v-slot="{ Component }">
                <transition name="fade">
                    <keep-alive>
                        <component :is="Component"></component>
                    </keep-alive>
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useStoreInfo } from "./stores/storeInfo.ts";
import { useApiCalls } from "./composables/useApiCalls.ts";
import { useRoute } from "vue-router";
import StoreHomeSkeleton from "./components/skeletons/StoreHomeSkeleton.vue";

const { storeInfo, updateStoreInfo } = useStoreInfo();
const { fetchStoreInfo } = useApiCalls();
const route = useRoute();
const eventRef = computed(() => route.params.slug);
console.log(eventRef.value);

// ✅ Call useQuery immediately with the computed slug
const storeQuery = fetchStoreInfo(eventRef);

const isLoading = computed(() => storeQuery.isLoading.value);
const routeName = computed(() => route.name);
</script>
