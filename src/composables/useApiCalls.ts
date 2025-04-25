import { useMutation, useQuery } from "@tanstack/vue-query";
import { apiGet, apiPost } from "../includes/api";
import { useStoreInfo } from "../stores/storeInfo";
import { useUtils } from "./useUtils";
import type { StoreInfo } from "../includes/interfaces";
import { computed } from "vue";

export function useApiCalls() {
    const { updateStoreInfo } = useStoreInfo();
    const { setTitle } = useUtils();

    // Fetch store info (requires eventRef)
    const fetchStoreInfo = (eventRef: { value: string }) =>
        useQuery({
            queryKey: ["storeInfo", eventRef],
            queryFn: async () => {
                if (!eventRef.value) throw new Error("Event ref is required");
                const response = await apiGet<StoreInfo>(`/inventory/event/${eventRef.value}/`);
                console.log("response", response);
                setTitle(`${response.event.store.store_name} -- Powered by Leyyow!`);
                updateStoreInfo(response);
                return response;

                // if (response.status === 200) {
                //     updateStoreInfo(response.data);
                //     setTitle(`${response.data.event.store.store_name} -- Powered by Leyyow!`);
                //     console.log("response", response.data);
                //     console.log("info", storeInfo);
                //     return response.data;
                // } else {
                //     console.log(response);
                //     throw new Error("Failed to fetch store info");
                // }
            },
            enabled: computed(() => !!eventRef.value), // Only run if eventRef exists
        });

    const createOrder = () => {
        return useMutation({
            mutationKey: ["createOrder"],
            mutationFn: async (data: any) => {
                return await apiPost("/inventory/orders/public/", data);
            },
        });
    };
    return { fetchStoreInfo, createOrder };
}
