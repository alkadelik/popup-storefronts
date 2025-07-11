<template>
    <Form
        v-slot="$form"
        :initialValues="getInitialValues(filteredProduct.id)"
        :resolver="resolver"
        :validateOnValueUpdate="true"
        :validateOnBlur="false"
        @submit="
            onFormSubmit($event, filteredProduct, price(filteredProduct), stock(filteredProduct), sku(filteredProduct))
        "
        class="flex flex-col gap-4 w-full py-4"
    >
        <div class="flex flex-wrap w-full gap-2">
            <div
                v-for="(variant, index) in variantNames(filteredProduct)"
                :key="index"
                :class="[
                    'flex flex-col gap-1',
                    variantNames(filteredProduct).length === 1
                        ? 'w-full'
                        : variantNames(filteredProduct).length === 2
                        ? 'w-[calc(50%-0.25rem)]'
                        : index < 2
                        ? 'w-[calc(50%-0.25rem)]'
                        : 'w-full',
                ]"
            >
                <label :for="`variant${index + 1}`">{{ variant }}</label>
                <Select
                    v-model="formState[filteredProduct.id][`variant${index + 1}`]"
                    :options="optionsArray(filteredProduct[`options${index + 1}`])"
                    :name="`variant${index + 1}`"
                    :placeholder="variant"
                    class="bg-white border rounded-md p-2"
                />
                <Message
                    v-if="$form[`variant${index + 1}`]?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-1"
                >
                    {{ $form[`variant${index + 1}`].error.message }}
                </Message>
            </div>
        </div>

        <div class="flex gap-2">
            <Button
                type="submit"
                severity="secondary"
                class="bg-black text-white h-13 w-full rounded-md cursor-pointer"
                :disabled="disabled"
            >
                <div v-if="!disabled" class="flex items-center gap-2">
                    <span v-if="!cartStore.getCartItemQuantity(filteredProduct)"> Add to Basket </span>
                    <span v-else>{{ cartStore.getCartItemQuantity(filteredProduct) }} in Basket</span>
                    <div class="relative">
                        <svg
                            width="16"
                            height="16"
                            class="h-5 w-5"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                opacity="0.4"
                                d="M12.8263 3.71988H12.5597L10.3063 1.46654C10.1263 1.28654 9.83301 1.28654 9.64634 1.46654C9.46634 1.64654 9.46634 1.93988 9.64634 2.12654L11.2397 3.71988H4.75967L6.35301 2.12654C6.53301 1.94654 6.53301 1.65321 6.35301 1.46654C6.17301 1.28654 5.87967 1.28654 5.69301 1.46654L3.44634 3.71988H3.17967C2.57967 3.71988 1.33301 3.71988 1.33301 5.42654C1.33301 6.07321 1.46634 6.49988 1.74634 6.77988C1.90634 6.94654 2.09967 7.03321 2.30634 7.07988C2.49967 7.12654 2.70634 7.13321 2.90634 7.13321H13.093C13.2997 7.13321 13.493 7.11988 13.6797 7.07988C14.2397 6.94654 14.6663 6.54654 14.6663 5.42654C14.6663 3.71988 13.4197 3.71988 12.8263 3.71988Z"
                                fill="white"
                            />
                            <path
                                d="M13.1 7.13341H2.90664C2.70664 7.13341 2.49997 7.12674 2.30664 7.08008L3.14664 12.2001C3.33331 13.3467 3.83331 14.6667 6.05331 14.6667H9.79331C12.04 14.6667 12.44 13.5401 12.68 12.2801L13.6866 7.08008C13.5 7.12008 13.3 7.13341 13.1 7.13341ZM7.07331 11.4401C7.07331 11.7001 6.86664 11.9067 6.60664 11.9067C6.34664 11.9067 6.13997 11.7001 6.13997 11.4401V9.24008C6.13997 8.98008 6.34664 8.77341 6.60664 8.77341C6.86664 8.77341 7.07331 8.98008 7.07331 9.24008V11.4401ZM9.92664 11.4401C9.92664 11.7001 9.71997 11.9067 9.45997 11.9067C9.19997 11.9067 8.99331 11.7001 8.99331 11.4401V9.24008C8.99331 8.98008 9.19997 8.77341 9.45997 8.77341C9.71997 8.77341 9.92664 8.98008 9.92664 9.24008V11.4401Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </div>
                <div v-else>Out of Stock</div>
            </Button>
        </div>
    </Form>
</template>

<script>
export default {
    props: {
        filteredProduct: Object,
        formState: Object,
        cartStore: Object,
        resolver: Function,
        getInitialValues: Function,
        variantNames: Function,
        optionsArray: Function,
        price: Function,
        stock: Function,
        sku: Function,
        onFormSubmit: Function,
        disabled: Boolean,
    },
};
</script>
