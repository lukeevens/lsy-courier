<template>
    <div>
        <div style="margin-bottom: 5px;">
            <el-input v-model="form.code" placeholder="请输入取件码" suffix-icon="el-icon-search" style="width: 200px;"
                      @keyup.enter.native="listPGet"></el-input>
            <el-button type="info" round style="margin-left: 8px" @click="listPGet">查询</el-button>
            <el-button type="primary" round style="margin-left: 8px" @click="add">新增</el-button>
        </div>
        <el-table
                :data="tableData"
                :header-cell-style="{background: '#f2f5fc',color: '#555'}"
                border>
            <el-table-column prop="pickupcodeid" label="PickupCodeId" width="100">
            </el-table-column>
            <el-table-column prop="orderid" label="订单ID" width="100">
            </el-table-column>
            <el-table-column prop="code" label="取件码" width="200">
            </el-table-column>
            <el-table-column prop="isused" label="IsUsed" width="100">
            </el-table-column>
            <el-table-column prop="generateddatetime" label="生成日期时间" width="200">
            </el-table-column>
            <el-table-column prop="useddatetime" label="使用日期" width="200">
            </el-table-column>
            <el-table-column prop="isvalid" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="warning" plain @click="mod(scope.row)">编辑</el-button>
                    <el-popconfirm
                            title="确定删除吗？"
                            @confirm="del(scope.row.pickupcodeid)"
                            style="margin-left: 5px"
                    >
                        <el-button slot="reference" size="small" type="danger" plain>删除</el-button>
                    </el-popconfirm>
                    <!--                                    <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
                title="提示"
                :visible.sync="centerDialogVisible"
                width="30%"
                center
                class="custom-dialog"
        >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="订单ID" prop="orderid">
                    <el-col :span="20">
                        <el-input v-model="form.orderid"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="取件码" prop="code">
                    <el-col :span="20">
                        <el-input v-model="form.code"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="IsUsed" prop="isused">
                    <el-col :span="20">
                        <el-input v-model="form.isused"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="生成日期时间" prop="generateddatetime">
                    <el-col :span="20">
                        <el-input v-model="form.generateddatetime"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="使用日期" prop="useddatetime">
                    <el-col :span="20">
                        <el-input v-model="form.useddatetime"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PickupcodeManage",
        data(){
            return{
                tableData:[],
                centerDialogVisible: false,
                form:{
                    pickupcodeid: '',
                    orderid: '',
                    code: '',
                    isused: '',
                    generateddatetime: '',
                    useddatetime: '',
                }
            }
        },
        methods:{
            //修改时获取到表单的数据
            mod(row){
                this.centerDialogVisible = true
                this.$nextTick(()=>{
                    //异步的方法
                    this.form.pickupcodeid = row.pickupcodeid
                    this.form.orderid = row.orderid
                    this.form.code = row.code
                    this.form.isused = row.isused
                    this.form.generateddatetime = row.generateddatetime
                    this.form.useddatetime = row.useddatetime
                })
            },
            //刷新表单
            resetForm() {
                this.$refs.form.resetFields();
            },
            add() {
                this.centerDialogVisible = true
                this.$nextTick(()=>{
                    //不能直接调用，要用异步的方法
                    this.resetForm();
                })
                this.resetForm();
            },
            // 添加
            doSave() {
                try {
                    this.$axios.post(this.$httpUrl + '/pickupcodes/save', this.form)
                        .then(res => res.data)
                        .then(res => {
                            this.centerDialogVisible = true;
                            if (res) {
                                this.$message({
                                    showClose: true,
                                    message: '操作成功！',
                                    type: 'success'
                                });
                                this.centerDialogVisible = false;
                                this.loadGet();
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: '操作失败！',
                                    type: 'error'
                                });
                            }
                        })
                        .catch(error => {
                            // 捕获 Axios 请求错误
                            console.error('Axios 请求错误:', error);

                            // 显示用户友好的错误信息
                            this.$message({
                                showClose: true,
                                message: '操作失败，发生了一个网络错误！',
                                type: 'error'
                            });
                        });
                } catch (error) {
                    // 捕获同步错误
                    console.error('发生了一个错误:', error);

                    // 显示用户友好的错误信息
                    this.$message({
                        showClose: true,
                        message: '操作失败，发生了一个未知错误！',
                        type: 'error'
                    });
                }
            },

            // 修改
            doMod() {
                try {
                    this.$axios.post(this.$httpUrl + '/pickupcodes/mod', this.form)
                        .then(res => res.data)
                        .then(res => {
                            if (res) {
                                this.$message({
                                    showClose: true,
                                    message: '操作成功！',
                                    type: 'success'
                                });
                                this.centerDialogVisible = false;
                                this.loadGet();
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: '操作失败',
                                    type: 'error'
                                });
                            }
                        })
                        .catch(error => {
                            // 捕获 Axios 请求错误
                            console.error('Axios 请求错误:', error);

                            // 显示用户友好的错误信息
                            this.$message({
                                showClose: true,
                                message: '操作失败，发生了一个网络错误！',
                                type: 'error'
                            });
                        });
                } catch (error) {
                    // 捕获同步错误
                    console.error('发生了一个错误:', error);

                    // 显示用户友好的错误信息
                    this.$message({
                        showClose: true,
                        message: '操作失败，发生了一个未知错误！',
                        type: 'error'
                    });
                }
            },

            // 添加或修改
            save() {
                try {
                    this.$refs.form.validate(valid => {
                        if (valid) {
                            if (this.form.pickupcodeid) {
                                this.doMod();
                            } else {
                                this.doSave();
                            }
                        } else {
                            console.log('提交失败，表单验证不通过！');
                        }
                    });
                } catch (error) {
                    // 捕获同步错误
                    console.error('发生了一个错误:', error);

                    // 显示用户友好的错误信息
                    this.$message({
                        showClose: true,
                        message: '操作失败，发生了一个未知错误！',
                        type: 'error'
                    });
                }
            },

            // 查询
            loadGet() {
                try {
                    this.$axios.get(this.$httpUrl + '/pickupcodes/list')
                        .then(res => {
                            if (res.status === 200) {
                                console.log(res);
                                this.tableData = res.data;
                            } else {
                                alert('获取数据失败');
                            }
                        })
                        .catch(error => {
                            // 捕获 Axios 请求错误
                            console.error('Axios 请求错误:', error);

                            // 显示用户友好的错误信息
                            this.$message({
                                showClose: true,
                                message: '操作失败，发生了一个网络错误！',
                                type: 'error'
                            });
                        });
                } catch (error) {
                    // 捕获同步错误
                    console.error('发生了一个错误:', error);

                    // 显示用户友好的错误信息
                    this.$message({
                        showClose: true,
                        message: '操作失败，发生了一个未知错误！',
                        type: 'error'
                    });
                }
            },

            // 根据取件码查询
            listPGet() {
                try {
                    this.$axios.post(this.$httpUrl + '/pickupcodes/listP', this.form)
                        .then(res => {
                            if (res.status === 200) {
                                this.tableData = res.data;
                            } else {
                                alert('获取数据失败');
                            }
                        })
                        .catch(error => {
                            // 捕获 Axios 请求错误
                            console.error('Axios 请求错误:', error);

                            // 显示用户友好的错误信息
                            this.$message({
                                showClose: true,
                                message: '操作失败，发生了一个网络错误！',
                                type: 'error'
                            });
                        });
                } catch (error) {
                    // 捕获同步错误
                    console.error('发生了一个错误:', error);

                    // 显示用户友好的错误信息
                    this.$message({
                        showClose: true,
                        message: '操作失败，发生了一个未知错误！',
                        type: 'error'
                    });
                }
            },

            // 删除
            del(pickupcodeid) {
                try {
                    this.$axios.get(this.$httpUrl + '/pickupcodes/delete?pickupcodeid=' + pickupcodeid)
                        .then(res => res.data)
                        .then(res => {
                            if (res) {
                                this.$message({
                                    showClose: true,
                                    message: '操作成功！',
                                    type: 'success'
                                });
                                this.loadGet();
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: '操作失败！',
                                    type: 'error'
                                });
                            }
                        })
                        .catch(error => {
                            // 捕获 Axios 请求错误
                            console.error('Axios 请求错误:', error);

                            // 显示用户友好的错误信息
                            this.$message({
                                showClose: true,
                                message: '操作失败，发生了一个网络错误！',
                                type: 'error'
                            });
                        });
                } catch (error) {
                    // 捕获同步错误
                    console.error('发生了一个错误:', error);

                    // 显示用户友好的错误信息
                    this.$message({
                        showClose: true,
                        message: '操作失败，发生了一个未知错误！',
                        type: 'error'
                    });
                }
            },
        },
        beforeMount() {
            this.loadGet();
        }
    }
</script>

<style scoped>
    .custom-dialog {
        /* 设置背景颜色 */
        background-color: #f0f0f0;

        /* 设置边框颜色和宽度 */
        border: 2px solid #333;
    }

    /* 设置标题栏背景颜色 */
    .el-dialog__header {
        background-color: #4CAF50; /* 绿色 */
    }

    /* 设置按钮的颜色 */
    .el-button {
        background-color: #008CBA; /* 蓝色 */
        color: #fff; /* 文字颜色为白色 */
    }

</style>