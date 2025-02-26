import Vue from "vue";
import VueRouter from "vue-router";
import home from "../components/home/Home";
import user from "../components/user/UserManage.vue";
import courier from "../components/courier/CourierManager";
import order from "../components/order/OrderManage";
import deliverypoint from "../components/deliverypoint/DeliverypointManager";
import pickupcode from "../components/pickupcode/PickupcodeManage";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../components/Login')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../components/Register')
    },
    {
        path: '/Index',
        name: 'index',
        component: () => import('../components/Index'),
        children: [
            {
                path: "/home",
                name: "home",
                component: home
            },
            {
                path: "/user",
                name: "user",
                component: user
            },
            {
                path: "/courier",
                name: "courier",
                component: courier
            },
            {
                path: "/order",
                name: "order",
                component: order
            },
            {
                path: "/deliverypoint",
                name: "deliverypoint",
                component: deliverypoint
            },
            {
                path: "/pickupcode",
                name: "pickupcode",
                component: pickupcode
            }
        ]
    }
]

const router = new VueRouter({
    routes,
});

export default router;