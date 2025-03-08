<template>
    <el-container class="main-container">
        <el-aside width="200px" class="aside">
            <Aside />
        </el-aside>
        <el-container>
            <el-header height="60px" class="header">
                <Header />
            </el-header>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Aside from './Aside.vue'
import Header from './Header.vue'

export default {
    name: 'Index',
    components: {
        Aside,
        Header
    }
}
</script>

<style scoped>
.main-container {
    height: 100vh;
    width: 100%;
}

.aside {
    background-color: #fff;
    box-shadow: 2px 0 6px rgba(0,21,41,.05);
}

.header {
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    padding: 0;
}

.main {
    background-color: #f0f2f5;
    padding: 20px;
}
</style>