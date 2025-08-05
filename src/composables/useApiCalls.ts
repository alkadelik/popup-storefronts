import { useMutation } from "@tanstack/vue-query";
import { apiGet, apiPost } from "../includes/api";
import { useStoreInfo } from "../stores/storeInfo";
import { useUtils } from "./useUtils";
import type { StoreInfo } from "../includes/interfaces";
import { useGlobalStore } from "../stores/global";
// import { computed } from "vue";

export function useApiCalls() {
    const { updateStoreInfo } = useStoreInfo();
    const { setTitle } = useUtils();
    const globalStore = useGlobalStore();

    // Fetch store info (requires eventSlug)
    const fetchStoreInfoQueryFn = async (params: { storeSlug: string; eventSlug: string; eventId: string }) => {
        if (!params?.storeSlug || !params?.eventSlug || !params?.eventId) {
            throw new Error("Missing storeSlug, eventSlug or eventId");
        }
        const response = await apiGet<StoreInfo>(`/inventory/stores/${params.storeSlug}/events/${params.eventSlug}/${params.eventId}/`);
        console.log("response", response);
        setTitle(`${response.event.store.store_name} -- Powered by Leyyow!`);
        updateStoreInfo(response);
        const eventEndDate = new Date(response.event.end_date);
        const now = new Date();
        if (eventEndDate < now) {
            console.log("Event has ended");
            
            globalStore.setShowEventClosed(true);
        }
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
