<!-- SideMenu.vue -->
<template>
    <el-menu
            style="height: 120vh"
            background-color="#fff"
            text-color="#000"
            active-text-color="#ffd04b"
            default-active="/Home"
            :collapse="isCollapse"
            menu-align="left"
            :collapse-transition="false"
            router
            class="blue-bordered-menu"
    >
        <el-menu-item index="/home" class="leftAligned">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
        </el-menu-item>

        <el-menu-item
                :index="`/${item.menuClick}`"
                v-for="(item, index) in menu"
                :key="index"
                class="leftAligned"
        >
            <div class="menu-item-content">
                <i :class="item.menuIcon"></i>
                <span slot="title">{{ item.menuName }}</span>
            </div>
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
                    { menuClick: "user", menuName: "用户管理", menuIcon: "el-icon-user-solid" },
                    { menuClick: "order", menuName: "订单管理", menuIcon: "el-icon-s-order" },
                    { menuClick: "pickupcode", menuName: "取件码管理", menuIcon: "el-icon-tickets" },
                    { menuClick: "courier", menuName: "快递员管理管理", menuIcon: "el-icon-user" },
                    { menuClick: "deliverypoint", menuName: "取件站管理", menuIcon: "el-icon-location-information" },
                ],
            };
        },
    };
</script>

<style scoped>
    .leftAligned {
        text-align: left;
        padding-left: 20px; /* 调整左边距 */
    }

    .menu-item-content {
        display: flex;
        align-items: center;
    }

    .menu-item-content i {
        margin-right: 10px; /* 调整图标和文字之间的间距 */
    }

    .el-menu-item {
        border-radius: 50px; /* 为圆形边框设置边框半径 */
        overflow: hidden; /* 隐藏溢出以确保圆形形状 */
    }

    .blue-bordered-menu {
        border-right: 2px solid #007BFF; /* 添加蓝色右边框 */
    }

    .leftAligned i {
        margin-right: 10px; /* 调整图标和文字之间的间距 */
        font-size: 16px; /* 图标的字体大小 */
        color: #007BFF; /* 图标颜色 */
    }
</style>
