<template>
    <div style="display: flex;line-height: 60px;">
        <div style="margin-top: 8px;">
            <i :class="icon" style="font-size: 20px;cursor: pointer;" @click="collapse"></i>
        </div>
        <div style="flex: 1; text-align: center; font-size: 20px; font-family: 'Arial', sans-serif; color: #333; font-weight: bold;">
            <span>快递管理系统</span>
        </div>
        <el-dropdown>
                <span class="el-dropdown-link">
      下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown>

        </el-dropdown>

    </div>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
            };
        },
        methods:{
            toUser(){
                this.$router.push("/home")
            },
            logout(){
                this.$confirm('您确定要退出登录吗?', '提示', {
                    confirmButtonText: '确定',  //确认按钮的文字显示
                    type: 'warning',
                    center: true, //文字居中显示

                })
                    .then(() => {
                        this.$message({
                            type:'success',
                            message:'退出登录成功'
                        })

                        this.$router.push("/")
                        sessionStorage.clear()
                    })
                    .catch(() => {
                        this.$message({
                            type:'info',
                            message:'已取消退出登录'
                        })
                    })
            },
        }
    };
</script>

<style scoped>
</style>
