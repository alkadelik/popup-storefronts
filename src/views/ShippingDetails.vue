<template>
    <div class="px-4 pb-2 pt-4 h-dvh flex flex-col">
        <h5 class="font-normal py-2">Shipping Details</h5>
        <p class="text-granite-gray">Kindly input your information</p>

        <Form
            v-slot="$form"
            :initialValues
            :validateOnValueUpdate="false"
            :validateOnBlur="true"
            @submit="onFormSubmit"
            class="flex flex-col gap-5 w-full mt-5 flex-1"
        >
            <div class="flex flex-col gap-5 flex-1 w-full">
                <div class="flex gap-2">
                    <div class="flex flex-col gap-1">
                        <label for="firstName" class="mb-1">First Name</label>
                        <InputText
                            v-model="initialValues.firstName"
                            name="firstName"
                            type="text"
                            placeholder="eg: Daniel"
                            fluid
                            class="px-4 py-3"
                        />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="lastName" class="mb-1">Last Name</label>
                        <InputText
                            v-model="initialValues.lastName"
                            name="lastName"
                            type="text"
                            placeholder="eg: Obode"
                            fluid
                            class="px-4 py-3"
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="email" class="mb-1">Email</label>
                    <InputText
                        v-model="initialValues.email"
                        name="email"
                        type="text"
                        placeholder="example@gmail.com"
                        fluid
                        class="px-4 py-3"
                    />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="phoneNumber" class="mb-1">Phone Number</label>
                    <InputNumber
                        v-model="initialValues.phoneNumber"
                        name="phoneNumber"
                        prefix="+"
                        :useGrouping="false"
                        placeholder="+2348076963928"
                        fluid
                    />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="instagram_handle" class="mb-1">Instagram Handle</label>
                    <InputText
                        v-model="initialValues.instagram_handle"
                        name="instagram_handle"
                        type="text"
                        placeholder="@ygseis"
                        fluid
                        class="px-4 py-3"
                    />
                </div>
            </div>

            <div class="flex gap-2 mb-4">
                <Button label="skip" class="w-24 bg-anti-flash-white text-black border-0" @click="goToNextPage()" />
                <Button
                    type="submit"
                    severity="secondary"
                    label="Proceed to Checkout"
                    class="py-3 flex-1 bg-black text-white"
                />
            </div>
        </Form>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useOrderStore } from "../stores/order";
import { useStoreInfo } from "../stores/storeInfo";
import { useRouter } from "vue-router";
import { useUtils } from "../composables/useUtils";

const router = useRouter();
const { shippingDetails: initialValues, resetShippingDetails } = useOrderStore();
const { storeInfo } = useStoreInfo();
const { formatNaira } = useUtils();

const onFormSubmit = () => {
    router.push({ name: "OrderSummary" });
};

const goToNextPage = () => {
    sessionStorage.removeItem("orderStore");
    resetShippingDetails();
    Object.keys(initialValues).forEach(key => {
        initialValues[key] = "";
    });
    router.push({ name: "OrderSummary" });
};
</script>
<style></style>
