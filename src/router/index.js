import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../page/home/Home.vue";
import User from "../page/user/User.vue";
import Courier from "../page/courier/Courier.vue";
import Order from "../page/order/Order.vue";
import DeliveryPoint from "../page/deliverypoint/DeliveryPoint.vue";
import PickupCode from "../page/pickupcode/PickupCode.vue";
import Feedback from "../page/feedback/Feedback.vue";
import Layout from '@/layout/Index.vue'
import TemperatureMonitor from '@/page/special/TemperatureMonitor.vue'
import AbnormalPackage from '@/page/special/AbnormalPackage.vue'
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/admin/package-records',
        children: [
            {
                path: '/admin/package-records',
                name: 'AdminPackageRecords',
                component: () => import('@/page/admin/AdminPackageRecords.vue'),
                meta: { title: '包裹记录', requireAuth: true }
            },
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
            },
            {
                path: '/special-package',
                name: 'TemperatureMonitor',
                component: TemperatureMonitor,
                // meta: { title: '温度监控', requireAuth: true }
            },
            {
                path: '/abnormal-package',
                name: 'AbnormalPackage',
                component: AbnormalPackage,
                // meta: { title: '温度监控', requireAuth: true }
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/page/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../page/Register')
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../layout/Index'),
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

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requireAuth && !token) {
        next('/login')
    } else {
        next()
    }
})

export default router;