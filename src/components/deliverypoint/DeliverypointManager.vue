<template>
    <div>
        <div style="margin-bottom: 5px;">
            <el-input v-model="form.pointname" placeholder="请输入站点名" suffix-icon="el-icon-search" style="width: 200px;"
                      @keyup.enter.native="listPGet"></el-input>
            <el-button type="info" round style="margin-left: 8px" @click="listPGet">查询</el-button>
            <el-button type="primary" round style="margin-left: 8px" @click="add">新增</el-button>
        </div>
        <el-table
                :data="tableData"
                :header-cell-style="{background: '#f2f5fc',color: '#555'}"
                border>
            <el-table-column prop="deliverypointid" label="DeliverypointId" width="200">
            </el-table-column>
            <el-table-column prop="pointname" label="站点名" width="200">
            </el-table-column>
            <el-table-column prop="contactnumber" label="联系电话" width="300">
            </el-table-column>
            <el-table-column prop="address" label="地址" width="300">
            </el-table-column>
            <el-table-column prop="isvalid" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="warning" plain @click="mod(scope.row)">编辑</el-button>
                    <el-popconfirm
                            title="确定删除吗？"
                            @confirm="del(scope.row.deliverypointid)"
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
                <el-form-item label="站点名" prop="pointname">
                    <el-col :span="20">
                        <el-input v-model="form.pointname"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-col :span="20">
                        <el-input v-model="form.address"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactnumber">
                    <el-col :span="20">
                        <el-input v-model="form.contactnumber"></el-input>
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
        name: "DeliverypointManager",
        data(){
            return{
                tableData:[],
                centerDialogVisible: false,
                form:{
                    deliverypointid: '',
                    pointname: '',
                    address:'',
                    contactnumber: '',
                }
            }
        },
        methods: {
            //修改时获取到表单的数据
            mod(row){
                this.centerDialogVisible = true
                this.$nextTick(()=>{
                    //异步的方法
                    this.form.deliverypointid = row.deliverypointid
                    this.form.pointname = row.pointname
                    this.form.address = row.address
                    this.form.contactnumber = row.contactnumber
                })
            },
            //刷新表单
            resetForm() {
                this.$refs.form.resetFields();
            },
            add() {
                this.centerDialogVisible = true
                this.$nextTick(() => {
                    //不能直接调用，要用异步的方法
                    this.resetForm();
                })
                this.resetForm();
            },
            // 添加
            doSave() {
                try {
                    this.$axios.post(this.$httpUrl + '/deliverypoints/save', this.form)
                        .then(res => res.data)
                        .then(res => {
                            this.centerDialogVisible = true;
                            console.log(res);
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
                    this.$axios.post(this.$httpUrl + '/deliverypoints/mod', this.form)
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
                            if (this.form.deliverypointid) {
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
                    this.$axios.get(this.$httpUrl + '/deliverypoints/list')
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

            // 根据站点名查询
            listPGet() {
                try {
                    this.$axios.post(this.$httpUrl + '/deliverypoints/listP', this.form)
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
            del(deliverypointid) {
                try {
                    this.$axios.get(this.$httpUrl + '/deliverypoints/delete?deliverypointid=' + deliverypointid)
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