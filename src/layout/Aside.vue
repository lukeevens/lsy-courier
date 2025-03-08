<!-- SideMenu.vue -->
<template>
    <el-menu :style="{ width: isCollapse ? '64px' : '200px' }" style="height: 100vh" background-color="#fff"
        text-color="#000" active-text-color="#409EFF" :default-active="$route.path" :collapse="isCollapse" router
        class="blue-bordered-menu">
        <div class="logo-container" :class="{ 'collapsed': isCollapse }">
            <i class="el-icon-s-promotion logo-icon"></i>
            <span class="logo-text" v-show="!isCollapse">快递管理系统</span>
        </div>

        <el-menu-item index="/home" class="menu-item">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
        </el-menu-item>

        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
            </template>
            <el-menu-item index="/user" class="menu-item">用户列表</el-menu-item>
        </el-submenu>

        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>快递员管理</span>
            </template>
            <el-menu-item index="/courier" class="menu-item">快递员列表</el-menu-item>
        </el-submenu>

        <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
            </template>
            <el-menu-item index="/order" class="menu-item">订单列表</el-menu-item>
        </el-submenu>

        <el-submenu index="4">
            <template slot="title">
                <i class="el-icon-location"></i>
                <span>取件点管理</span>
            </template>
            <el-menu-item index="/deliverypoint" class="menu-item">取件点列表</el-menu-item>
        </el-submenu>

        <el-submenu index="5">
            <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>取件码管理</span>
            </template>
            <el-menu-item index="/pickupcode" class="menu-item">取件码列表</el-menu-item>
        </el-submenu>

        <el-submenu index="6">
            <template slot="title">
                <i class="el-icon-chat-line-round"></i>
                <span>评价反馈</span>
            </template>
            <el-menu-item index="/feedback" class="menu-item">评价列表</el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
    name: "Aside",
    data() {
        return {
            isCollapse: false
        };
    },
    created() {
        // 监听折叠事件
        this.$bus.$on('toggle-collapse', (isCollapse) => {
            this.isCollapse = isCollapse
        })
    },
    beforeDestroy() {
        // 组件销毁前移除事件监听
        this.$bus.$off('toggle-collapse')
    }
};
</script>

<style scoped>
.blue-bordered-menu {
    border-right: 2px solid #409EFF;
    transition: width 0.3s;
}

.logo-container {
    height: 60px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    overflow: hidden;
    white-space: nowrap;
}

.logo-container.collapsed {
    padding: 0 20px;
}

.logo-icon {
    font-size: 24px;
    color: #409EFF;
    margin-right: 12px;
}

.logo-text {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
}

.menu-item {
    border-radius: 4px;
    margin: 4px 8px;
}

.menu-item:hover {
    background-color: #ecf5ff !important;
}

.el-menu {
    border-right: none;
}

.el-menu-item [class^="el-icon-"],
.el-submenu [class^="el-icon-"] {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    color: #409EFF;
}

.el-submenu__title:hover {
    background-color: #ecf5ff !important;
}

/* 折叠动画 */
.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
}
</style>
