import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/home/Home.vue";
import User from "../components/user/User.vue";
import Courier from "../components/courier/Courier.vue";
import Order from "../components/order/Order.vue";
import DeliveryPoint from "../components/deliverypoint/DeliveryPoint.vue";
import PickupCode from "../components/pickupcode/PickupCode.vue";
import Feedback from "../components/feedback/Feedback.vue";

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
        path: '/index',
        name: 'index',
        component: () => import('../components/Index'),
        children: [
            {
                path: "/home",
                name: "home",
                component: Home
            },
            {
                path: "/user",
                name: "user",
                component: User
            },
            {
                path: "/courier",
                name: "courier",
                component: Courier
            },
            {
                path: "/order",
                name: "order",
                component: Order
            },
            {
                path: "/deliverypoint",
                name: "deliverypoint",
                component: DeliveryPoint
            },
            {
                path: "/pickupcode",
                name: "pickupcode",
                component: PickupCode
            },
            {
                path: "/feedback",
                name: "feedback",
                component: Feedback
            }
        ]
    }
]

const router = new VueRouter({
    routes,
});

export default router;