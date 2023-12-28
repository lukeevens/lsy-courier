<!-- SideMenu.vue -->
<template>
    <el-menu style="height: 120vh"
             background-color="#2c3b4b"
             text-color="#fff"
             active-text-color="#ffd04b"
             default-active="/Home"
             :collapse="isCollapse"
             menu-align="left"
             :collapse-transition="false"
             router
    >
        <el-menu-item index="/home" class="leftAligned">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
        </el-menu-item>

        <el-menu-item :index="`/${item.menuClick}`" v-for="(item, index) in menu" :key="index" class="leftAligned">
            <i :class="item.menuIcon"></i>
            <span slot="title">{{ item.menuName }}</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: "SideMenu",
        data() {
            return {
                isCollapse: false,
                defaultActive: "/home", // 设置默认激活的菜单项
                menu: [
                    { menuClick: 'user', menuName: '用户管理', menuIcon: 'el-icon-user-solid' },
                    { menuClick: 'order', menuName: '订单管理', menuIcon: 'el-icon-s-order' },
                    { menuClick: 'pickupcode', menuName: '取件码管理', menuIcon: 'el-icon-tickets' },
                    { menuClick: 'courier', menuName: '快递员管理管理', menuIcon: 'el-icon-user' },
                    { menuClick: 'deliverypoint', menuName: '取件站管理', menuIcon: 'el-icon-location-information' },
                ]
            };
        }
    };
</script>

<style scoped>
    .leftAligned {
        text-align: left;
        padding-left: 20px; /* 调整左边距 */
    }
</style>
