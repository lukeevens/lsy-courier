<template>
    <div class="temperature-monitor">
        <!-- 统计卡片 -->
        <el-row :gutter="20" class="stats-row">
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="stats-item">
                        <i class="el-icon-warning" style="color: #F56C6C;"></i>
                        <div class="stats-info">
                            <div class="stats-title">温度异常</div>
                            <div class="stats-number">{{ stats.abnormalCount }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="stats-item">
                        <i class="el-icon-time" style="color: #E6A23C;"></i>
                        <div class="stats-info">
                            <div class="stats-title">即将到期</div>
                            <div class="stats-number">{{ stats.deadlineCount }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="stats-item">
                        <i class="el-icon-box" style="color: #409EFF;"></i>
                        <div class="stats-info">
                            <div class="stats-title">监控中</div>
                            <div class="stats-number">{{ stats.monitoringCount }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="stats-item">
                        <i class="el-icon-success" style="color: #67C23A;"></i>
                        <div class="stats-info">
                            <div class="stats-title">正常运输</div>
                            <div class="stats-number">{{ stats.normalCount }}</div>
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
                    <el-select v-model="searchForm.status" placeholder="状态" clearable>
                        <el-option label="正常" value="normal"></el-option>
                        <el-option label="异常" value="abnormal"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 包裹列表 -->
        <el-card class="table-card">
            <el-table :data="packageList" v-loading="loading" border>
                <el-table-column prop="trackingNumber" label="运单号" width="180"></el-table-column>
                <el-table-column prop="currentTemp" label="当前温度" width="120">
                    <template slot-scope="scope">
                        <span :class="{'danger-text': scope.row.isAbnormal}">
                            {{ scope.row.currentTemp }}°C
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="requiredTempRange" label="要求温度" width="150"></el-table-column>
                <el-table-column prop="deliveryDeadline" label="送达期限" width="180"></el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="温度趋势" width="300">
                    <template slot-scope="scope">
                        <div class="temperature-chart" ref="tempChart"></div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="viewDetails(scope.row)">查看详情</el-button>
                        <el-button type="text" @click="sendNotification(scope.row)">发送通知</el-button>
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

        <!-- 详情弹窗 -->
        <el-dialog title="温度监控详情" :visible.sync="detailDialogVisible" width="70%">
            <div class="detail-container">
                <div class="detail-chart"></div>
                <div class="detail-info">
                    <el-descriptions :column="2" border>
                        <!-- 包裹详细信息 -->
                    </el-descriptions>
                    <div class="temperature-history">
                        <!-- 温度历史记录 -->
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'TemperatureMonitor',
    data() {
        return {
            loading: false,
            stats: {
                abnormalCount: 0,
                deadlineCount: 0,
                monitoringCount: 0,
                normalCount: 0
            },
            searchForm: {
                trackingNumber: '',
                status: ''
            },
            packageList: [],
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            detailDialogVisible: false
        }
    },
    methods: {
        getStatusType(status) {
            const types = {
                '正常': 'success',
                '异常': 'danger',
                '即将到期': 'warning'
            }
            return types[status] || 'info'
        },
        async fetchData() {
            this.loading = true
            try {
                const res = await this.$axios.get('/api/packages/special', {
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
                status: ''
            }
            this.handleSearch()
        },
        viewDetails(row) {
            this.detailDialogVisible = true
            // 加载详细数据...
        },
        async sendNotification(row) {
            try {
                await this.$axios.post(`/api/packages/${row.id}/notify`, {
                    notificationType: 'temperature',
                    message: `包裹${row.trackingNumber}温度异常，请注意查收`
                })
                this.$message.success('通知发送成功')
            } catch (error) {
                this.$message.error('通知发送失败')
            }
        }
    },
    created() {
        this.fetchData()
    }
}
</script>

<style scoped>
.temperature-monitor {
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

.temperature-chart {
    height: 50px;
}

.pagination-container {
    margin-top: 20px;
    text-align: right;
}

.detail-container {
    padding: 20px;
}

.detail-chart {
    height: 300px;
    margin-bottom: 20px;
}

.temperature-history {
    margin-top: 20px;
    max-height: 300px;
    overflow-y: auto;
}
</style> 