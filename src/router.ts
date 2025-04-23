import { nextTick } from "vue";
import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/",
        redirect: "/demo",
    },
    {
        path: "/:slug",
        component: () => import("./views/StoreHome.vue"),
        name: "StoreHome",
    },
    {
        path: "/:slug/product",
        component: () => import("./views/ProductDetails.vue"),
        name: "ProductDetail",
    },
    {
        path: "/:slug/cart",
        component: () => import("./views/CartPage.vue"),
        name: "Cart",
    },
    {
        path: "/:slug/order-successful/:id",
        component: () => import("./views/OrderSuccessful.vue"),
        name: "OrderSuccessful",
    },
    {
        path: "/:slug/order/summary",
        component: () => import("./views/OrderSummary.vue"),
        name: "OrderSummary",
    },
    {
        path: "/:slug/order/shipping",
        component: () => import("./views/ShippingDetails.vue"),
        name: "ShippingDetails",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to) {
        return new Promise((resolve) => {
            nextTick(() => {
                if (to.hash) {
                    const id = to.hash.replace("#", "");

                    const scrollToElement = () => {
                        const el = document.getElementById(id);
                        if (el) {
                            el.scrollIntoView({ behavior: "auto" });
                            resolve(); // finish the scroll behavior
                        } else {
                            // Keep checking until the element appears
                            setTimeout(scrollToElement, 100);
                        }
                    };

                    scrollToElement();
                } else {
                    window.scrollTo({ top: 0, behavior: "auto" });
                    resolve();
                }
            });
        });
    },
});

export default router;
