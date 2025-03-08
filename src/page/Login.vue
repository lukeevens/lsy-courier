<template>
    <div class="loginBody">
        <div class="loginDiv">
            <div class="login-content">
                <h1 class="login-title">用户登录</h1>
                <el-form :model="loginForm" label-width="100px" :rules="rules" ref="loginForm">
                    <el-form-item label="用户名" prop="no">
                        <el-input style="width: 200px" type="text" v-model="loginForm.username" autocomplete="off"
                            size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input style="width: 200px" type="password" v-model="loginForm.password" show-password
                            autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
                    </el-form-item>
                    <el-form-item class="button-container">
                        <el-button type="primary" @click="confirm" :disabled="confirm_disabled">确 定</el-button>
                        <el-button type="primary" @click="register">注 册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: "Login",
    data() {
        return {
            confirm_disabled: false,
            loginForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输密码', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        confirm() {
            this.confirm_disabled = true;
            this.$refs.loginForm.validate((valid) => {
                if (valid) { //valid成功为true，失败为false
                    //去后台验证用户名密码
                    // this.$axios.post(this.$httpUrl+'/users/login',this.loginForm).then(res=>{
                    //     console.log(res)
                    //     if(res.status==200){
                    //         //跳转到主页
                    //         this.$router.replace('/Index');
                    //     }else{
                    //         this.confirm_disabled=false;
                    //         alert('校验失败，用户名或密码错误！');
                    //         return false;
                    //     }
                    // });
                    this.$router.replace('/Index');
                } else {
                    this.confirm_disabled = false;
                    console.log('校验失败');
                    return false;
                }
            });
        },
        register() {
            this.$router.push("/register")
        }
    }
}
</script>

<style scoped>
.loginBody {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../assets/OIP-C.jpg') no-repeat center center fixed;
    background-size: cover;
}

.loginDiv {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -250px;
    width: 450px;
    height: 330px;
    background: #fff;
    border-radius: 5%;

}

.login-title {
    margin: 20px 0;
    text-align: center;
}

.login-content {
    width: 400px;
    height: 250px;
    position: absolute;
    top: 25px;
    left: 25px;
}

.button-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}
</style>