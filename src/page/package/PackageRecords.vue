<template>
  <div class="package-records">
    <el-card class="record-card">
      <div slot="header" class="card-header">
        <span>我的包裹记录</span>
        <el-button type="primary" size="small" @click="refreshRecords">刷新</el-button>
      </div>

      <el-table
        :data="packageRecords"
        style="width: 100%"
        stripe
        v-loading="loading">
        <el-table-column prop="trackingNumber" label="快递单号" width="180"/>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="arrivalTime" label="到达时间" width="180"/>
        <el-table-column prop="pickupCode" label="取件码" width="120"/>
        <el-table-column prop="location" label="取件点" width="180"/>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="viewDetails(scope.row)"
              icon="el-icon-view">
              查看详情
            </el-button>
            <el-button
              size="mini"
              type="success"
              v-if="scope.row.status === '待取件'"
              @click="showQRCode(scope.row)"
              icon="el-icon-picture-outline">
              查看二维码
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 二维码弹窗 -->
    <el-dialog title="取件二维码" :visible.sync="qrDialogVisible" width="30%">
      <div class="qr-container">
        <img :src="currentQRCode" alt="取件二维码" class="qr-code"/>
        <p class="qr-tip">请在快递柜前出示此二维码进行取件</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PackageRecords',
  data() {
    return {
      loading: false,
      packageRecords: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      qrDialogVisible: false,
      currentQRCode: '',
    };
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '待取件': 'warning',
        '已取件': 'success',
        '运输中': 'primary',
        '已过期': 'danger'
      };
      return statusMap[status] || 'info';
    },
    refreshRecords() {
      this.loading = true;
      // TODO: 调用API获取包裹记录
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    viewDetails(row) {
      // TODO: 实现查看详情逻辑
    },
    showQRCode(row) {
      // TODO: 获取并显示取件二维码
      this.qrDialogVisible = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.refreshRecords();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshRecords();
    }
  },
  created() {
    this.refreshRecords();
  }
};
</script>

<style scoped>
.package-records {
  padding: 20px;
}

.record-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.qr-container {
  text-align: center;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin-bottom: 15px;
}

.qr-tip {
  color: #666;
  font-size: 14px;
}
</style> 