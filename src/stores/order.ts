import { defineStore } from "pinia";
import { reactive } from "vue";
import type { ShippingDetails } from "../includes/interfaces";

export const useOrderStore = defineStore(
    "order",
    () => {
        let shippingDetails = reactive<ShippingDetails>({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            instagram_handle: "",
        });

        const resetShippingDetails = () => {
            shippingDetails = reactive({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                instagram_handle: "",
            });
        }

        return {
            shippingDetails,
            resetShippingDetails,
        };
    },

    {
        persist: {
            key: "orderStore",
            storage: sessionStorage,
        },
    },
);
