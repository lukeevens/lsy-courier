<template>
    <div class="abnormal-package">
        <!-- 统计卡片 -->
        <el-row :gutter="20" class="stats-row">
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="stats-item">
                        <i class="el-icon-warning" style="color: #F56C6C;"></i>
                        <div class="stats-info">
                            <div class="stats-title">温度异常</div>
                            <div class="stats-number">{{ stats.temperatureAbnormal }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="stats-item">
                        <i class="el-icon-time" style="color: #E6A23C;"></i>
                        <div class="stats-info">
                            <div class="stats-title">时限异常</div>
                            <div class="stats-number">{{ stats.deadlineAbnormal }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="stats-item">
                        <i class="el-icon-bell" style="color: #409EFF;"></i>
                        <div class="stats-info">
                            <div class="stats-title">待处理</div>
                            <div class="stats-number">{{ stats.pendingCount }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 搜索栏 -->
        <el-card class="search-card">
            <el-form :inline="true" :model="searchForm">
                <el-form-item>
                    <el-input v-model="searchForm.trackingNumber" placeholder="运单号" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.abnormalType" placeholder="异常类型" clearable>
                        <el-option label="温度异常" value="temperature"></el-option>
                        <el-option label="时限异常" value="deadline"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.status" placeholder="处理状态" clearable>
                        <el-option label="待处理" value="pending"></el-option>
                        <el-option label="处理中" value="processing"></el-option>
                        <el-option label="已处理" value="resolved"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="searchForm.dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 异常包裹列表 -->
        <el-card class="table-card">
            <el-table :data="packageList" v-loading="loading" border>
                <el-table-column prop="trackingNumber" label="运单号" width="180"></el-table-column>
                <el-table-column prop="abnormalType" label="异常类型" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="getAbnormalType(scope.row.abnormalType)" effect="dark">
                            {{ scope.row.abnormalType === 'temperature' ? '温度异常' : '时限异常' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="abnormalValue" label="异常数值" width="150">
                    <template slot-scope="scope">
                        <span :class="{'danger-text': scope.row.abnormalType === 'temperature'}">
                            {{ scope.row.abnormalValue }}
                            {{ scope.row.abnormalType === 'temperature' ? '°C' : '小时' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="detectedTime" label="检测时间" width="180"></el-table-column>
                <el-table-column prop="status" label="处理状态" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                            {{ getStatusText(scope.row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="handler" label="处理人" width="120"></el-table-column>
                <el-table-column prop="remark" label="处理备注" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleAbnormal(scope.row)">处理</el-button>
                        <el-button type="text" @click="viewDetails(scope.row)">详情</el-button>
                        <el-button type="text" @click="sendNotification(scope.row)">通知</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="page.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total">
                </el-pagination>
            </div>
        </el-card>

        <!-- 处理异常弹窗 -->
        <el-dialog title="处理异常" :visible.sync="handleDialogVisible" width="50%">
            <el-form :model="handleForm" label-width="100px">
                <el-form-item label="处理状态">
                    <el-select v-model="handleForm.status" style="width: 100%">
                        <el-option label="处理中" value="processing"></el-option>
                        <el-option label="已处理" value="resolved"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="处理备注">
                    <el-input type="textarea" v-model="handleForm.remark" rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="handleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitHandle">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'AbnormalPackage',
    data() {
        return {
            loading: false,
            stats: {
                temperatureAbnormal: 0,
                deadlineAbnormal: 0,
                pendingCount: 0
            },
            searchForm: {
                trackingNumber: '',
                abnormalType: '',
                status: '',
                dateRange: []
            },
            packageList: [],
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            handleDialogVisible: false,
            handleForm: {
                id: '',
                status: '',
                remark: ''
            }
        }
    },
    methods: {
        getAbnormalType(type) {
            return type === 'temperature' ? 'danger' : 'warning'
        },
        getStatusType(status) {
            const types = {
                'pending': 'info',
                'processing': 'warning',
                'resolved': 'success'
            }
            return types[status] || 'info'
        },
        getStatusText(status) {
            const texts = {
                'pending': '待处理',
                'processing': '处理中',
                'resolved': '已处理'
            }
            return texts[status] || status
        },
        async fetchData() {
            this.loading = true
            try {
                const res = await this.$axios.get('/api/packages/abnormal', {
                    params: {
                        page: this.page.current,
                        pageSize: this.page.size,
                        ...this.searchForm
                    }
                })
                this.packageList = res.data.list
                this.page.total = res.data.total
                this.stats = res.data.stats
            } catch (error) {
                console.error('获取数据失败:', error)
                this.$message.error('获取数据失败')
            }
            this.loading = false
        },
        handleSearch() {
            this.page.current = 1
            this.fetchData()
        },
        resetForm() {
            this.searchForm = {
                trackingNumber: '',
                abnormalType: '',
                status: '',
                dateRange: []
            }
            this.handleSearch()
        },
        handleAbnormal(row) {
            this.handleForm = {
                id: row.id,
                status: 'processing',
                remark: ''
            }
            this.handleDialogVisible = true
        },
        async submitHandle() {
            try {
                await this.$axios.put(`/api/packages/${this.handleForm.id}/abnormal/resolve`, this.handleForm)
                this.$message.success('处理成功')
                this.handleDialogVisible = false
                this.fetchData()
            } catch (error) {
                this.$message.error('处理失败')
            }
        },
        viewDetails(row) {
            // 查看详情逻辑
        },
        async sendNotification(row) {
            try {
                await this.$axios.post(`/api/packages/${row.id}/notify`, {
                    notificationType: row.abnormalType,
                    message: `包裹${row.trackingNumber}出现${row.abnormalType === 'temperature' ? '温度' : '时限'}异常，请及时处理`
                })
                this.$message.success('通知发送成功')
            } catch (error) {
                this.$message.error('通知发送失败')
            }
        },
        handleSizeChange(val) {
            this.page.size = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.page.current = val
            this.fetchData()
        }
    },
    created() {
        this.fetchData()
    }
}
</script>

<style scoped>
.abnormal-package {
    padding: 20px;
}

.stats-row {
    margin-bottom: 20px;
}

.stats-item {
    display: flex;
    align-items: center;
}

.stats-item i {
    font-size: 48px;
    margin-right: 20px;
}

.stats-info {
    flex: 1;
}

.stats-title {
    font-size: 14px;
    color: #909399;
}

.stats-number {
    font-size: 24px;
    font-weight: bold;
    margin-top: 5px;
}

.search-card {
    margin-bottom: 20px;
}

.table-card {
    margin-bottom: 20px;
}

.danger-text {
    color: #F56C6C;
}

.pagination-container {
    margin-top: 20px;
    text-align: right;
}
</style> 