<template>
    <div class="flex flex-col w-full h-screen overflow-y-hidden">
        <Navbar />

        <ToastSuccess :visible="(visible = 'success')" @close="visible = false" :text="toastText" />

        <Toast class="w-8/9 flex items-center" :visible="error" />

        <section class="overflow-y-auto flex-1">
            <div
                class="p-4 last-of-type:min-h-185"
                v-for="filteredProduct in filteredProducts"
                :key="filteredProduct.id"
                :id="`${filteredProduct.id}`"
            >
                <!-- product image  -->
                <ProductImage :filteredProduct="filteredProduct" />

                <ProductInfo
                    :filteredProduct="filteredProduct"
                    :price="price"
                    @share-clicked="shareUrl"
                    :has-variants="variantNames(filteredProduct).length > 0"
                    :stock-left="stock(filteredProduct)"
                    :showStock="isVariantSelectionComplete(filteredProduct)"
                />

                <ProductVariantsForm
                    :filteredProduct="filteredProduct"
                    :formState="formState"
                    :cartStore="cartStore"
                    :resolver="getResolverForProduct(filteredProduct)"
                    :getInitialValues="getInitialValues"
                    :variantNames="variantNames"
                    :optionsArray="optionsArray"
                    :price="price"
                    :stock="stock"
                    :sku="sku"
                    :onFormSubmit="onFormSubmit"
                    :disabled="isVariantSelectionComplete(filteredProduct) && stock(filteredProduct) === 0"
                />
            </div>
        </section>
        <!--  -->
        <div class="h-15 shadow-[0px_-4px_8px_0px_#00000014] p-4 flex items-center">
            <div class="flex justify-end items-center w-full">
                <FullCartButton :totalProducts="totalProducts" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import Navbar from "../components/product-details/ProductNavbar.vue";
import ToastSuccess from "../components/utils/ToastSuccess.vue";
import ProductVariantsForm from "../components/product-details/ProductVariantsForm.vue";
import ProductImage from "../components/product-details/ProductImage.vue";
import ProductInfo from "../components/product-details/ProductInfo.vue";
import FullCartButton from "../components/product-details/FullCartButton.vue";
import { useProductStore } from "../stores/product";
import { useToast } from "primevue/usetoast";
import { useCartStore } from "../stores/cart";
import { useStoreInfo } from "../stores/storeInfo";
import type { Product, StoreInfo } from "../includes/interfaces";

// data
const productStore = useProductStore();
const cartStore = useCartStore();
const { storeInfo } = useStoreInfo();
const toast = useToast();
const toastText = ref("");
const visible = ref<String | Boolean>(false);
const error = ref(false);
const formState = reactive<
    Record<number | string, { variant1: string; variant2: string; variant3: string; quantity: number }>
>({
    default: { variant1: "", variant2: "", variant3: "", quantity: 1 },
});

// computed properties
const filteredProducts = computed(() => productStore.filteredProducts);
const totalProducts = computed(() => cartStore.cart.reduce((sum, item) => sum + item.selected_quantity, 0));

// methods
const variantNames = (product: Product) => {
    const names = product.variants.split(",").filter(Boolean);
    return names;
};

const optionsArray = (option: string) => {
    if (!option) {
        console.warn("optionsArray called with undefined");
        return;
    }
    const options = option.split(",").filter(Boolean);
    return options;
};

const price = (product: Product) => {
    getInitialValues(product.id);
    let skuObject = null;
    const id = (storeInfo as StoreInfo)?.event.id;

    if (variantNames(product).length) {
        skuObject = product.sku.find((item) => {
            return (
                item.option1 === formState[product.id].variant1 &&
                item.option2 === formState[product.id].variant2 &&
                item.option3 === formState[product.id].variant3
            );
        });
    } else {
        skuObject = product.sku[0];
    }

    return skuObject?.event_data?.[id]?.price || product.price;
};

const stock = (product: Product) => {
    getInitialValues(product.id);
    let skuObject = null;
    const id = (storeInfo as StoreInfo)?.event.id;

    if (variantNames(product).length) {
        skuObject = (product.sku || []).find((item) => {
            return (
                item.option1 === formState[product.id].variant1 &&
                item.option2 === formState[product.id].variant2 &&
                item.option3 === formState[product.id].variant3
            );
        });
    } else {
        skuObject = product.sku[0];
    }

    if (skuObject && !skuObject.event_data) {
        return 0;
    }

    return skuObject?.event_data?.[id]?.qty || 0;
};

const sku = (product: Product) => {
    getInitialValues(product.id);
    let skuObject = null;

    if (variantNames(product).length) {
        skuObject = (product.sku || []).find((item) => {
            return (
                item.option1 === formState[product.id].variant1 &&
                item.option2 === formState[product.id].variant2 &&
                item.option3 === formState[product.id].variant3
            );
        });
    } else {
        skuObject = product.sku[0];
    }

    return skuObject?.id;
};

const getInitialValues = (productId: number) => {
    if (!formState[productId]) {
        formState[productId] = {
            variant1: "",
            variant2: "",
            variant3: "",
            quantity: 1,
        };
    }
    return formState[productId];
};

const getResolverForProduct = (product: Product) => {
    return ({ values }: { values: Record<string, any> }) => {
        return resolver({ values, product });
    };
};

const resolver = ({ values, product }: { values: Record<string, any>; product: Product }) => {
    const errors: Record<string, { message: string }[]> = {};
    const variants = variantNames(product);

    if (!values.variant1 && variants[0]) {
        errors.variant1 = [{ message: `Please select ${variants[0]}` }];
    }

    if (!values.variant2 && variants[1]) {
        errors.variant2 = [{ message: `Please select ${variants[1]}` }];
    }

    if (!values.variant3 && variants[2]) {
        errors.variant3 = [{ message: `Please select ${variants[2]}` }];
    }

    return {
        errors,
        values,
    };
};

const shareUrl = (productId: number) => {
    const baseUrl = `${window.location.origin}/store/product#${productId}`;
    if (navigator.share) {
        navigator
            .share({
                title: document.title,
                url: baseUrl,
            })
            .then(() => console.log("Successfully shared"))
            .catch((error) => console.error("Error sharing", error));
    } else {
        console.error("Web Share API not supported in this browser");
    }
};

const isVariantSelectionComplete = (product: Product) => {
    const variants = variantNames(product);
    const form = formState[product.id] || {};
    if (variants.length === 0) return true;
    if (variants.length === 1) return !!form.variant1;
    if (variants.length === 2) return !!form.variant1 && !!form.variant2;
    if (variants.length === 3) return !!form.variant1 && !!form.variant2 && !!form.variant3;
    return false;
};

const onFormSubmit = (
    { valid }: { valid: boolean },
    product: Product,
    variantPrice: number,
    stockLeft: number,
    sku: number,
) => {
    if (stockLeft === 0) {
        error.value = true;
        toast.add({ severity: "info", detail: "Item is not available in stock", life: 1000 });
        return;
    } else if (valid && cartStore.isInStock(product, formState[product.id])) {
        toastText.value = "Item added to cart";
        toast.add({
            severity: "custom",
            life: 2000,
            group: "headless",
            styleClass: "w-full",
        });
        visible.value = "success";
        cartStore.addToCart(product, formState[product.id], variantPrice, stockLeft, sku);
        visible.value = false;
    } else {
        error.value = true;
        toast.add({ severity: "info", detail: "All available stock are in your cart", life: 1000 });
    }
};
</script>
