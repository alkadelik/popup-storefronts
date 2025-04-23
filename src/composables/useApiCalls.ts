import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { apiGet, apiPost } from "../includes/api";
import { useStoreInfo } from "../stores/storeInfo";
import { useUtils } from "./useUtils";
import type { StoreInfo } from "../includes/interfaces";
import { computed } from "vue";

export function useApiCalls() {
    const { updateStoreInfo } = useStoreInfo();
    const { setFavicon, setTitle } = useUtils();
    
    // Fetch store info (requires merchantSlug)
    const fetchStoreInfo = (merchantSlug: { value: string; }) =>
        useQuery({
            queryKey: ["storeInfo", merchantSlug],
            queryFn: async () => {
                if (!merchantSlug.value) throw new Error("Merchant slug is required");
                const response = (await apiGet(`/account/store-website/public/${merchantSlug.value}/`)) as {
                    status: number;
                    data: StoreInfo;
                };

                if (response.status === 200) {
                    updateStoreInfo(response.data);
                    setFavicon(response.data.store_logo);
                    setTitle(`${response.data.store_name} -- Powered by Leyyow!`);
                    console.log(response.data);
                    return response.data;
                } else {
                    console.log(response);
                    throw new Error("Failed to fetch store info");
                }
            },
            enabled: computed(() => !!merchantSlug.value), // Only run if merchantSlug exists
        });

    const createOrder = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationKey: ["createOrder"],
            mutationFn: async (data: any) => {
                return await apiPost("/inventory/orders/public/", data);
            },
            onSuccess: async (orderData: any) => {
                queryClient.refetchQueries({ queryKey: ["storeInfo"] });
                window.location.href = `https://checkout.paystack.com/${orderData.data.access_code}`;
            },
        });
    }
    return { fetchStoreInfo, createOrder };
}
