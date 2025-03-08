<template>
  <div class="order-container">
    <!-- 搜索和操作栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.keyword" placeholder="订单号/快递单号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="订单状态" clearable>
            <el-option label="待取件" value="待取件"></el-option>
            <el-option label="运输中" value="运输中"></el-option>
            <el-option label="已送达" value="已送达"></el-option>
            <el-option label="已取件" value="已取件"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="success" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stats-item">
            <div class="stats-icon">
              <i class="el-icon-s-order"></i>
            </div>
            <div class="stats-info">
              <div class="stats-title">今日订单</div>
              <div class="stats-number">{{ orderStats.today }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stats-item">
            <div class="stats-icon">
              <i class="el-icon-time"></i>
            </div>
            <div class="stats-info">
              <div class="stats-title">待处理</div>
              <div class="stats-number">{{ orderStats.pending }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stats-item">
            <div class="stats-icon">
              <i class="el-icon-circle-check"></i>
            </div>
            <div class="stats-info">
              <div class="stats-title">已完成</div>
              <div class="stats-number">{{ orderStats.delivered }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stats-item">
            <div class="stats-icon">
              <i class="el-icon-money"></i>
            </div>
            <div class="stats-info">
              <div class="stats-title">总收入</div>
              <div class="stats-number">¥{{ orderStats.income }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单列表 -->
    <el-table :data="orderList" v-loading="loading" border style="width: 100%">
      <el-table-column prop="orderNo" label="订单号" width="120"></el-table-column>
      <el-table-column prop="trackingNumber" label="快递单号" width="120"></el-table-column>
      <el-table-column label="寄件信息" width="200">
        <template slot-scope="scope">
          <div>{{ scope.row.senderName }}</div>
          <div>{{ scope.row.senderPhone }}</div>
          <div class="address-text">{{ scope.row.senderAddress }}</div>
        </template>
      </el-table-column>
      <el-table-column label="收件信息" width="200">
        <template slot-scope="scope">
          <div>{{ scope.row.receiverName }}</div>
          <div>{{ scope.row.receiverPhone }}</div>
          <div class="address-text">{{ scope.row.receiverAddress }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="100">
        <template slot-scope="scope">
          ¥{{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column prop="payStatus" label="支付状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.payStatus === '已支付' ? 'success' : 'danger'">
            {{ scope.row.payStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="courierName" label="快递员" width="100"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="text" @click="handleUpdateStatus(scope.row)">更新状态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 状态更新对话框 -->
    <el-dialog title="更新订单状态" :visible.sync="statusDialogVisible" width="400px">
      <el-form :model="statusForm" ref="statusForm" label-width="100px">
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="statusForm.status" style="width: 100%">
            <el-option label="待取件" value="待取件"></el-option>
            <el-option label="运输中" value="运输中"></el-option>
            <el-option label="已送达" value="已送达"></el-option>
            <el-option label="已取件" value="已取件"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="statusForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitStatusUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Order',
  data() {
    return {
      searchForm: {
        keyword: '',
        status: '',
        dateRange: []
      },
      orderList: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      orderStats: {
        total: 0,
        today: 0,
        pending: 0,
        delivered: 0,
        cancelled: 0,
        income: 0
      },
      statusDialogVisible: false,
      statusForm: {
        orderId: '',
        status: '',
        remark: ''
      }
    }
  },
  created() {
    this.fetchOrderList()
    this.fetchOrderStats()
  },
  methods: {
    getStatusType(status) {
      const types = {
        '待取件': 'info',
        '运输中': 'warning',
        '已送达': 'success',
        '已取件': 'success',
        '已取消': 'danger'
      }
      return types[status] || 'info'
    },
    async fetchOrderList() {
      this.loading = true
      try {
        const res = await this.$axios.get('/api/order/list', {
          params: {
            page: this.page.current,
            size: this.page.size,
            ...this.searchForm
          }
        })
        this.orderList = res.data.list
        this.page.total = res.data.total
      } catch (error) {
        console.error('获取订单列表失败:', error)
        this.$message.error('获取订单列表失败')
      }
      this.loading = false
    },
    async fetchOrderStats() {
      try {
        const res = await this.$axios.get('/api/order/stats')
        this.orderStats = res.data
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    },
    handleSearch() {
      this.page.current = 1
      this.fetchOrderList()
    },
    handleExport() {
      this.$message.success('订单数据导出成功')
    },
    handleSizeChange(val) {
      this.page.size = val
      this.fetchOrderList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchOrderList()
    },
    handleDetail(row) {
      // 实现订单详情查看逻辑
      console.log('查看订单详情:', row)
    },
    handleUpdateStatus(row) {
      this.statusForm = {
        orderId: row.id,
        status: row.status,
        remark: ''
      }
      this.statusDialogVisible = true
    },
    async submitStatusUpdate() {
      try {
        await this.$axios.put('/api/order/update', this.statusForm)
        this.$message.success('状态更新成功')
        this.statusDialogVisible = false
        this.fetchOrderList()
      } catch (error) {
        console.error('更新订单状态失败:', error)
        this.$message.error('更新订单状态失败')
      }
    }
  }
}
</script>

<style scoped>
.order-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stats-item {
  display: flex;
  align-items: center;
}

.stats-icon {
  font-size: 48px;
  margin-right: 20px;
  color: #409EFF;
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
  color: #303133;
  margin-top: 5px;
}

.address-text {
  color: #606266;
  font-size: 13px;
  margin-top: 5px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.el-table {
  margin-top: 20px;
}
</style> 