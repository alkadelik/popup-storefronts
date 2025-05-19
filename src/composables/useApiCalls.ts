import { useMutation } from "@tanstack/vue-query";
import { apiGet, apiPost } from "../includes/api";
import { useStoreInfo } from "../stores/storeInfo";
import { useUtils } from "./useUtils";
import type { StoreInfo } from "../includes/interfaces";
// import { computed } from "vue";

export function useApiCalls() {
    const { updateStoreInfo } = useStoreInfo();
    const { setTitle } = useUtils();

    // Fetch store info (requires eventSlug)
    const fetchStoreInfoQueryFn = async (params: { storeSlug: string; eventSlug: string }) => {
        if (!params?.storeSlug || !params?.eventSlug) {
            throw new Error("Missing storeSlug or eventSlug");
        }
        const response = await apiGet<StoreInfo>(`/inventory/stores/${params.storeSlug}/events/${params.eventSlug}/`);
        console.log("response", response);
        setTitle(`${response.event.store.store_name} -- Powered by Leyyow!`);
        updateStoreInfo(response);
        return response;
    };

    const createOrder = () => {
        return useMutation({
            mutationKey: ["createOrder"],
            mutationFn: async (data: any) => {
                return await apiPost("/inventory/orders/public/", data);
            },
        });
    };
    return { fetchStoreInfoQueryFn, createOrder };
}
