<template>
    <div class="loginBody">
        <div class="loginDiv">
            <div class="login-content">
                <h1 class="login-title">用户注册</h1>
                <el-form :model="registerForm" label-width="100px"
                         :rules="rules" ref="loginForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input type="text" v-model="registerForm.username"
                                  autocomplete="off" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="registerForm.password"
                                  show-password autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input type="password" v-model="registerForm.confirmPassword"
                                  size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="fullname">
                        <el-input type="text" v-model="registerForm.fullname"
                                  size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input type="text" v-model="registerForm.address"
                                  size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="contactnumber">
                        <el-input type="text" v-model="registerForm.contactnumber"
                                  size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                registerForm: {
                    username: '',
                    password: '',
                    confirmPassword: '',
                    fullname: '',
                    address: '',
                    contactnumber: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
                    ],
                    confirmPassword: [
                        { required: true, message: '请确认密码', trigger: 'blur' },
                        { validator: this.validateConfirmPassword, trigger: 'blur' }
                    ],
                    fullname: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入地址', trigger: 'blur' }
                    ],
                    contactnumber: [
                        { required: true, message: '请输入联系方式', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            async submitForm() {
                // 删除 confirmPassword 字段
                delete this.registerForm.confirmPassword;
                try {
                    // 发送 POST 请求
                    const response = await this.$axios.post(this.$httpUrl + '/users/save', this.registerForm);
                    if (response.status === 200) {
                        // 注册成功，可以根据后端返回的数据进行其他处理
                        this.$router.replace('/');
                        alert('注册成功');
                    } else {
                        // 其他状态码，可能是服务器返回的错误
                        alert('注册失败：' + response.data.message || '未知错误');
                    }
                } catch (error) {
                    // 捕获异常，可能是网络错误等
                    console.error('注册失败：', error.message);
                    alert('注册失败：网络错误');
                }
            },
            validateConfirmPassword(rule, value, callback) {
                if (value !== this.registerForm.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            }
        }
    };
</script>

<style scoped>
    .loginBody {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #B3C0D1;
    }
    .loginDiv {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -200px;
        margin-left: -250px;
        width: 450px;
        height: 550px;
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
</style>
