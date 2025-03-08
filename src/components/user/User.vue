<template>
    <div class="user-container">
        <!-- 搜索和操作栏 -->
        <div class="search-bar">
            <el-form :inline="true" :model="searchForm">
                <el-form-item>
                    <el-input v-model="searchForm.keyword" placeholder="用户名/姓名/手机号" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.status" placeholder="状态" clearable>
                        <el-option label="活跃" value="active"></el-option>
                        <el-option label="禁用" value="inactive"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button type="success" @click="handleAdd">新增用户</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 用户列表 -->
        <el-table :data="userList" v-loading="loading" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="username" label="用户名" width="120"></el-table-column>
            <el-table-column prop="name" label="姓名" width="100"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="registerTime" label="注册时间" width="180"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
                        {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" class="delete-btn">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="page.current" :page-sizes="[10, 20, 50, 100]" :page-size="page.size"
                layout="total, sizes, prev, pager, next, jumper" :total="page.total">
            </el-pagination>
        </div>

        <!-- 用户表单对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
            <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="userForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="userForm.address"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="userForm.status" style="width: 100%">
                        <el-option label="活跃" value="active"></el-option>
                        <el-option label="禁用" value="inactive"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'User',
    data() {
        return {
            searchForm: {
                keyword: '',
                status: ''
            },
            userList: [],
            loading: false,
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            dialogVisible: false,
            dialogTitle: '',
            userForm: {
                id: '',
                username: '',
                name: '',
                phone: '',
                email: '',
                address: '',
                status: 'active'
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.fetchUserList()
    },
    methods: {
        async fetchUserList() {
            this.loading = true
            try {
                const res = await this.$axios.get('/api/user/list', {
                    params: {
                        page: this.page.current,
                        size: this.page.size,
                        ...this.searchForm
                    }
                })
                this.userList = res.data.list
                this.page.total = res.data.total
            } catch (error) {
                console.error('获取用户列表失败:', error)
                this.$message.error('获取用户列表失败')
            }
            this.loading = false
        },
        handleSearch() {
            this.page.current = 1
            this.fetchUserList()
        },
        handleSizeChange(val) {
            this.page.size = val
            this.fetchUserList()
        },
        handleCurrentChange(val) {
            this.page.current = val
            this.fetchUserList()
        },
        handleAdd() {
            this.dialogTitle = '新增用户'
            this.userForm = {
                id: '',
                username: '',
                name: '',
                phone: '',
                email: '',
                address: '',
                status: 'active'
            }
            this.dialogVisible = true
        },
        handleEdit(row) {
            this.dialogTitle = '编辑用户'
            this.userForm = { ...row }
            this.dialogVisible = true
        },
        async handleDelete(row) {
            try {
                await this.$confirm('确认删除该用户?', '提示', {
                    type: 'warning'
                })
                await this.$axios.delete(`/api/user/delete/${row.id}`)
                this.$message.success('删除成功')
                this.fetchUserList()
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('删除用户失败:', error)
                    this.$message.error('删除用户失败')
                }
            }
        },
        async handleSubmit() {
            try {
                await this.$refs.userForm.validate()
                if (this.userForm.id) {
                    await this.$axios.put('/api/user/update', this.userForm)
                    this.$message.success('更新成功')
                } else {
                    await this.$axios.post('/api/user/add', this.userForm)
                    this.$message.success('添加成功')
                }
                this.dialogVisible = false
                this.fetchUserList()
            } catch (error) {
                if (error !== false) {
                    console.error('保存用户失败:', error)
                    this.$message.error('保存用户失败')
                }
            }
        }
    }
}
</script>

<style scoped>
.user-container {
    padding: 20px;
}

.search-bar {
    margin-bottom: 20px;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
}

.pagination-container {
    margin-top: 20px;
    text-align: right;
}

.delete-btn {
    color: #F56C6C;
}

.el-table {
    margin-top: 20px;
}
</style>