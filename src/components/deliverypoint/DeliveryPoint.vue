<template>
  <div class="delivery-point-container">
    <!-- 搜索和操作栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.keyword" placeholder="名称/地址/负责人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="运营状态" clearable>
            <el-option label="正常运营" value="正常运营"></el-option>
            <el-option label="暂停服务" value="暂停服务"></el-option>
            <el-option label="已关闭" value="已关闭"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="success" @click="handleAdd">新增取件点</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 取件点列表 -->
    <el-table :data="pointList" v-loading="loading" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="取件点名称" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="manager" label="负责人" width="120"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
      <el-table-column label="容量情况" width="180">
        <template slot-scope="scope">
          <el-progress 
            :percentage="Math.round((scope.row.used / scope.row.capacity) * 100)"
            :format="format"
            :status="getCapacityStatus(scope.row)">
          </el-progress>
          <div class="capacity-text">{{ scope.row.used }}/{{ scope.row.capacity }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="openTime" label="营业时间" width="120"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="120"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleUpdateStatus(scope.row)">更新状态</el-button>
          <el-button type="text" class="delete-btn" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 取件点表单对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="pointForm" :rules="rules" ref="pointForm" label-width="100px">
        <el-form-item label="取件点名称" prop="name">
          <el-input v-model="pointForm.name"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="pointForm.address"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="pointForm.manager"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="pointForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="最大容量" prop="capacity">
          <el-input-number v-model="pointForm.capacity" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="营业时间" prop="openTime">
          <el-time-picker
            is-range
            v-model="timeRange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            value-format="HH:mm"
            @change="handleTimeChange">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="运营状态" prop="status">
          <el-select v-model="pointForm.status" style="width: 100%">
            <el-option label="正常运营" value="正常运营"></el-option>
            <el-option label="暂停服务" value="暂停服务"></el-option>
            <el-option label="已关闭" value="已关闭"></el-option>
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
  name: 'DeliveryPoint',
  data() {
    return {
      searchForm: {
        keyword: '',
        status: ''
      },
      pointList: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      timeRange: [],
      pointForm: {
        id: '',
        name: '',
        address: '',
        manager: '',
        phone: '',
        capacity: 100,
        openTime: '',
        status: '正常运营'
      },
      rules: {
        name: [
          { required: true, message: '请输入取件点名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '请输入最大容量', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchPointList()
  },
  methods: {
    getStatusType(status) {
      const types = {
        '正常运营': 'success',
        '暂停服务': 'warning',
        '已关闭': 'info'
      }
      return types[status] || 'info'
    },
    getCapacityStatus(row) {
      const percentage = (row.used / row.capacity) * 100
      if (percentage >= 90) return 'exception'
      if (percentage >= 70) return 'warning'
      return 'success'
    },
    format(percentage) {
      return percentage + '%'
    },
    async fetchPointList() {
      this.loading = true
      try {
        const res = await this.$axios.get('/api/deliverypoint/list', {
          params: {
            page: this.page.current,
            size: this.page.size,
            ...this.searchForm
          }
        })
        this.pointList = res.data.list
        this.page.total = res.data.total
      } catch (error) {
        console.error('获取取件点列表失败:', error)
        this.$message.error('获取取件点列表失败')
      }
      this.loading = false
    },
    handleSearch() {
      this.page.current = 1
      this.fetchPointList()
    },
    handleSizeChange(val) {
      this.page.size = val
      this.fetchPointList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchPointList()
    },
    handleTimeChange(val) {
      if (val) {
        this.pointForm.openTime = val[0] + '-' + val[1]
      }
    },
    handleAdd() {
      this.dialogTitle = '新增取件点'
      this.pointForm = {
        id: '',
        name: '',
        address: '',
        manager: '',
        phone: '',
        capacity: 100,
        openTime: '',
        status: '正常运营'
      }
      this.timeRange = []
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑取件点'
      this.pointForm = { ...row }
      if (row.openTime) {
        const times = row.openTime.split('-')
        this.timeRange = times
      }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该取件点?', '提示', {
          type: 'warning'
        })
        await this.$axios.delete(`/api/deliverypoint/delete/${row.id}`)
        this.$message.success('删除成功')
        this.fetchPointList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除取件点失败:', error)
          this.$message.error('删除取件点失败')
        }
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.pointForm.validate()
        if (this.pointForm.id) {
          await this.$axios.put('/api/deliverypoint/update', this.pointForm)
          this.$message.success('更新成功')
        } else {
          await this.$axios.post('/api/deliverypoint/add', this.pointForm)
          this.$message.success('添加成功')
        }
        this.dialogVisible = false
        this.fetchPointList()
      } catch (error) {
        if (error !== false) {
          console.error('保存取件点失败:', error)
          this.$message.error('保存取件点失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.delivery-point-container {
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

.capacity-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  text-align: center;
}

.el-table {
  margin-top: 20px;
}

.el-progress {
  margin-top: 8px;
}
</style> 