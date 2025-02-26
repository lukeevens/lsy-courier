<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <!-- 页眉（顶部） -->
        <el-header style="text-align: right; font-size: 12px; height: 8vh; border-bottom: rgb(254,229,0) 1px solid">
            <Header @doCollapse="doCollapse" :icon="icon">
            </Header>
        </el-header>

        <!-- 主体内容（下方） -->
        <el-container style="height: 100%">
            <!-- 侧栏（左侧） -->
            <el-aside :width="aside_width" style="background-color: rgb(79,125,198)">
                <Aside :isCollapse="isCollapse"></Aside>
            </el-aside>
            <!-- 主要内容（右侧） -->
            <el-main style="height: 100%">
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Aside from "@/components/Aside";
    import Header from "@/components/Header";

    export default {
        // eslint-disable-next-line vue/multi-word-component-names
        name: "Index",
        components: {Header, Aside},
        data() {
            return {
                isCollapse: false,
                aside_width: '180px',
                icon: 'el-icon-s-fold'
            }
        },
        methods: {
            doCollapse() {
                console.log('doCollapse')
                this.isCollapse = !this.isCollapse;
                // eslint-disable-next-line no-empty
                if (!this.isCollapse) {//展开
                    this.aside_width = '200px'
                    this.icon = 'el-icon-s-fold'
                    // eslint-disable-next-line no-empty
                } else {//关起
                    this.aside_width = '64px'
                    this.icon = 'el-icon-s-unfold'
                }
            }
        }
    }
</script>

<style scoped>
    .el-header {
        background-color: #e0d3a4;
        color: #333;
        line-height: 40px;
    }

    .el-aside {
        color: #333;
    }

</style>