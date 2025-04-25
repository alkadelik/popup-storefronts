import { defineStore } from "pinia";
import { ref } from "vue";
import type { StoreInfo } from "../includes/interfaces";

export const useStoreInfo = defineStore(
    "storeInfo",
    () => {
        const storeInfo = ref<StoreInfo | null>(null);

        const updateStoreInfo = (info: StoreInfo) => {
            storeInfo.value = info; // ✅ properly reactive assignment
        };

        return {
            storeInfo,
            updateStoreInfo,
        };
    },
    {
        persist: {
            key: "storeInfo",
            storage: sessionStorage,
        },
    },
);
