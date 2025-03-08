<template>
    <div class="layout">
        <div class="header">
            <!-- 头部导航 -->
        </div>
        <div class="main">
            <div class="sidebar">
                <!-- 侧边栏 -->
            </div>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Layout'
}
</script>

<style scoped>
.layout {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.main {
    flex: 1;
    display: flex;
}

.content {
    flex: 1;
    padding: 20px;
    overflow: auto;
}
</style>