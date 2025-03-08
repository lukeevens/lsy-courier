<template>
  <div class="admin-package-records">
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="快递单号">
          <el-input v-model="filterForm.trackingNumber" placeholder="请输入快递单号"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""/>
            <el-option label="待取件" value="pending"/>
            <el-option label="已取件" value="picked"/>
            <el-option label="已过期" value="expired"/>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchRecords" icon="el-icon-search">搜索</el-button>
          <el-button @click="resetForm" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div slot="header" class="card-header">
        <span>包裹记录管理</span>
        <el-button-group>
          <el-button type="primary" size="small" @click="exportData" icon="el-icon-download">导出数据</el-button>
          <el-button type="success" size="small" @click="addPackage" icon="el-icon-plus">新增包裹</el-button>
        </el-button-group>
      </div>

      <el-table
        :data="packageRecords"
        style="width: 100%"
        border
        v-loading="loading">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="trackingNumber" label="快递单号" width="180"/>
        <el-table-column prop="recipientPhone" label="收件人电话" width="150"/>
        <el-table-column prop="size" label="包裹大小" width="120"/>
        <el-table-column prop="weight" label="重量(kg)" width="120"/>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="arrivalTime" label="到达时间" width="180"/>
        <el-table-column prop="pickupCode" label="取件码" width="120"/>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editPackage(scope.row)"
              icon="el-icon-edit">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="success"
              @click="sendNotification(scope.row)"
              icon="el-icon-message">
              发送通知
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deletePackage(scope.row)"
              icon="el-icon-delete">
              删除
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
  </div>
</template>

<script>
export default {
  name: 'AdminPackageRecords',
  data() {
    return {
      loading: false,
      filterForm: {
        trackingNumber: '',
        status: '',
        dateRange: []
      },
      packageRecords: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '待取件': 'warning',
        '已取件': 'success',
        '已过期': 'danger'
      };
      return statusMap[status] || 'info';
    },
    searchRecords() {
      this.loading = true;
      // TODO: 实现搜索逻辑
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    resetForm() {
      this.filterForm = {
        trackingNumber: '',
        status: '',
        dateRange: []
      };
    },
    exportData() {
      // TODO: 实现导出数据逻辑
    },
    addPackage() {
      // TODO: 实现新增包裹逻辑
    },
    editPackage(row) {
      // TODO: 实现编辑包裹逻辑
    },
    sendNotification(row) {
      // TODO: 实现发送通知逻辑
    },
    deletePackage(row) {
      // TODO: 实现删除包裹逻辑
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchRecords();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchRecords();
    }
  },
  created() {
    this.searchRecords();
  }
};
</script>

<style scoped>
.admin-package-records {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
}

.table-card {
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
</style> 