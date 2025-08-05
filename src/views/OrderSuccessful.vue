<template>
    <div class="flex flex-col h-dvh w-full overflow-y-hidden">
        <div class="flex-1 overflow-y-auto flex justify-center items-center">
            <div class="flex flex-col items-center text-center p-4">
                <ToastSuccess :visible="(visible = 'success')" @close="visible = false" :text="toastText" />

                <img src="../assets/images/gifs/order-successful.gif" alt="carboard box gif" />

                <h6 class="py-3">Your order has been placed</h6>

                <p class="text-granite-gray">Present your reference number to pick up your order.</p>

                <div class="rounded-md border border-platinum px-2 py-3 w-full text-granite-gray mt-3">
                    <p>Reference Number</p>
                    <h4 class="font-bold mt-2">{{ orderId }}</h4>
                </div>
            </div>
        </div>
        <div class="h-20 p-4 flex flex-col gap-2">
            <router-link :to="{ name: 'Store', params: { storeSlug: storeSlug, eventSlug: eventSlug, eventId: eventId } }">
                <button class="w-full bg-black text-white py-3 rounded-md">Back to Shop</button>
            </router-link>
        </div>
    </div>
</template>
<script setup>
import { useToast } from "primevue/usetoast";
import { useRoute } from "vue-router";
import { useCartStore } from "../stores/cart";
import { useOrderStore } from "../stores/order";
import { onMounted, ref } from "vue";
import ToastSuccess from "../components/utils/ToastSuccess.vue";
import { useQueryClient } from "@tanstack/vue-query";

onMounted(() => {
    useCartStore().clearCart();
    const queryClient = useQueryClient();
    queryClient.refetchQueries({ queryKey: ["storeInfo"] });
});

const route = useRoute();
const storeSlug = route.params.storeSlug;
const eventSlug = route.params.eventSlug;
const eventId = route.params.eventId;
const orderId = route.params.id;
const { shippingDetails } = useOrderStore();
const toastText = ref("");
const toast = useToast();

const copy = () => {
    navigator.clipboard
        .writeText(`#${orderId}`)
        .then(() => {
            toastText.value = "Order Reference copied to clipboard!";
            toast.add({
                severity: "custom",
                life: 2000,
                group: "headless",
                styleClass: "w-full",
            });
            visible.value = "success";
        })
        .catch((err) => {
            toast.add({ severity: "error", summary: "Error", detail: "Failed to copy Order ID" });
        });
};
</script>
<style lang=""></style>
