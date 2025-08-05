import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore(
    "global",
    () => {
        const showNotFound = ref(false);
        const showEventClosed = ref(false);

        const setShowNotFound = (value: boolean) => {
            showNotFound.value = value;
        };

        const setShowEventClosed = (value: boolean) => {
            showEventClosed.value = value;
        };

        return {
            showNotFound,
            setShowNotFound,
            showEventClosed,
            setShowEventClosed,
        };
    },
);
