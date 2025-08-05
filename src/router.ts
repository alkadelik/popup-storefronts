import { nextTick } from "vue";
import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/",
        redirect: "/not-found",
    },
    {
        path: "/:storeSlug/events/:eventSlug/:eventId",
        component: () => import("./views/StoreHome.vue"),
        name: "Store",
    },
    {
        path: "/:storeSlug/events/:eventSlug/:eventId/product",
        component: () => import("./views/ProductDetails.vue"),
        name: "ProductDetail",
    },
    {
        path: "/:storeSlug/events/:eventSlug/:eventId/cart",
        component: () => import("./views/CartPage.vue"),
        name: "Cart",
    },
    {
        path: "/:storeSlug/events/:eventSlug/:eventId/store/order-successful/:id",
        component: () => import("./views/OrderSuccessful.vue"),
        name: "OrderSuccessful",
    },
    {
        path: "/:storeSlug/events/:eventSlug/:eventId/order/summary",
        component: () => import("./views/OrderSummary.vue"),
        name: "OrderSummary",
    },
    {
        path: "/:storeSlug/events/:eventSlug/:eventId/order/shipping",
        component: () => import("./views/ShippingDetails.vue"),
        name: "ShippingDetails",
    },
    {
        path: "/not-found",
        component: () => import("./views/404Page.vue"),
        name: "NotFound",
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
