import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { CartItem, Selections, Product } from "../includes/interfaces";
import { getCurrentStoreSlug } from "../includes/utils";

export const useCartStore = defineStore(
    "cart",
    () => {
        const cart = ref<CartItem[]>([]);
        const cartTotal = computed<Number>(() => cart.value.reduce((sum, item) => sum + (item.variant_price * item.selected_quantity), 0));
        const cartLength = computed<Number>(() => cart.value.length);

        // 🛒 Add items to the cart
        function addToCart(
            product: Product,
            selections: Selections,
            price: number,
            stockLeft: number,
            sku: number,
        ) {
            const item = cart.value.find(
                (i) =>
                    i.id === product.id &&
                    i.selected_variant1 === selections.variant1 &&
                    i.selected_variant2 === selections.variant2 &&
                    i.selected_variant3 === selections.variant3
            );
            if (item) {
                if (item.selected_quantity < item.variant_total_stock) {
                    item.selected_quantity += 1;
                    item.itemTotal = item.variant_price * item.selected_quantity;
                } else {
                    return;
                }
            } else {
                const cartItem = { ...product } as CartItem;
                cartItem.selected_variant1 = selections.variant1;
                cartItem.selected_variant2 = selections.variant2;
                cartItem.selected_variant3 = selections.variant3;
                cartItem.selected_quantity = 1;
                cartItem.variant_price = price;
                cartItem.variant_total_stock = stockLeft;
                cartItem.itemTotal = price * selections.quantity;
                cartItem.selected_sku = sku;
                cart.value.push(cartItem);
            }
        }

        // 🔍 Check if a product with exact variants is in the cart
        function getCartItemQuantity(product: Product) {
            const items = cart.value.filter((i) => i.id === product.id);
            return items.reduce((sum, item) => sum + item.selected_quantity, 0);
        }

        // ✅ Remove a specific selection from the cart
        function removeSelection(cartItem: CartItem) {
            const del: CartItem | undefined = cart.value.find(
                (i) =>
                    i.id === cartItem.id &&
                    (cartItem.selected_variant1 ? i.selected_variant1 === cartItem.selected_variant1 : true) &&
                    (cartItem.selected_variant2 ? i.selected_variant2 === cartItem.selected_variant2 : true) &&
                    (cartItem.selected_variant3 ? i.selected_variant3 === cartItem.selected_variant3 : true),
            );
            if (del) {
                const index = cart.value.indexOf(del);
                cart.value.splice(index, 1);
            }
        }

        // ➕ Increase quantity of a selection
        function increaseSelectionQuantity(cartItem: CartItem) {
            const item = cart.value.find(
                (i) =>
                    i.id === cartItem.id &&
                    (cartItem.selected_variant1 ? i.selected_variant1 === cartItem.selected_variant1 : true) &&
                    (cartItem.selected_variant2 ? i.selected_variant2 === cartItem.selected_variant2 : true) &&
                    (cartItem.selected_variant3 ? i.selected_variant3 === cartItem.selected_variant3 : true),
            );
            if (item) {
                if (item.selected_quantity < (item.variant_total_stock || item.total_stock)) {
                    item.selected_quantity += 1;
                    item.itemTotal = item.variant_price * item.selected_quantity;
                }
            }
        }

        // ➖ Decrease quantity of a selection (removes item if quantity reaches 0)
        function decreaseSelectionQuantity(cartItem: CartItem) {
            const item = cart.value.find(
                (i) =>
                    i.id === cartItem.id &&
                    (cartItem.selected_variant1 ? i.selected_variant1 === cartItem.selected_variant1 : true) &&
                    (cartItem.selected_variant2 ? i.selected_variant2 === cartItem.selected_variant2 : true) &&
                    (cartItem.selected_variant3 ? i.selected_variant3 === cartItem.selected_variant3 : true),
            );
            if (item && item.selected_quantity > 1) {
                item.selected_quantity -= 1;
                item.itemTotal = item.variant_price * item.selected_quantity;
            }
        }

        function updateSelectionQuantity(cartItem: CartItem, quantity: number) {
            const item = cart.value.find(
                (i) =>
                    i.id === cartItem.id &&
                    (cartItem.selected_variant1 ? i.selected_variant1 === cartItem.selected_variant1 : true) &&
                    (cartItem.selected_variant2 ? i.selected_variant2 === cartItem.selected_variant2 : true) &&
                    (cartItem.selected_variant3 ? i.selected_variant3 === cartItem.selected_variant3 : true),
            );
            if (item) {
                if (quantity > item.variant_total_stock) {
                    item.selected_quantity = item.variant_total_stock;
                } else {
                    item.selected_quantity = quantity;
                }
                item.itemTotal = item.variant_price * item.selected_quantity;
            } else {
                return;
            }
        }

        function isProductInCart(product: Product) {
            return cart.value.some((i) => i.id === product.id);
        }

        function isInStock(
            product: Product,
            selections: Selections,
        ) {
            const item = cart.value.find(
                (i) =>
                    i.id === product.id &&
                    i.selected_variant1 === selections.variant1 &&
                    i.selected_variant2 === selections.variant2 &&
                    i.selected_variant3 === selections.variant3,
            );

            if (item) {
                console.log(
                    `Variant total stock: ${item.variant_total_stock}, Selected quantity: ${item.selected_quantity}`,
                );
                return item.variant_total_stock > item.selected_quantity;
            } else {
                return true;
            }
        }

        function totalProductsCount() { 
            return cart.value.reduce((sum, item) => sum + item.selected_quantity, 0);
        }

        function clearCart() {
            cart.value = [];
        }

        watch(cartLength, (newLength) => {
            console.log("Cart length changed:", newLength);
        });

        watch(cartTotal, (newTotal) => {
            console.log("Cart total changed:", newTotal);
        });

        return {
            cart,
            cartTotal,
            cartLength,
            addToCart,
            getCartItemQuantity,
            isProductInCart,
            isInStock,
            removeSelection,
            increaseSelectionQuantity,
            decreaseSelectionQuantity,
            updateSelectionQuantity,
            clearCart,
            totalProductsCount,
        };
    },
    {
        persist: {
            key: `cartStore-${getCurrentStoreSlug()}`,
            storage: sessionStorage,
        },
    },
);
