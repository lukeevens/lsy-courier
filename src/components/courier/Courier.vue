<template>
  <div class="courier-container">
    <!-- 搜索和操作栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.keyword" placeholder="姓名/工号/手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="状态" clearable>
            <el-option label="在岗" value="在岗"></el-option>
            <el-option label="休假" value="休假"></el-option>
            <el-option label="离职" value="离职"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="success" @click="handleAdd">新增快递员</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stats-item">
            <div class="stats-icon">
              <i class="el-icon-s-data"></i>
            </div>
            <div class="stats-info">
              <div class="stats-title">今日派送</div>
              <div class="stats-number">{{ courierStats.deliveryStats.today }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stats-item">
            <div class="stats-icon">
              <i class="el-icon-s-order"></i>
            </div>
            <div class="stats-info">
              <div class="stats-title">本月派送</div>
              <div class="stats-number">{{ courierStats.deliveryStats.month }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stats-item">
            <div class="stats-icon">
              <i class="el-icon-star-on"></i>
            </div>
            <div class="stats-info">
              <div class="stats-title">平均评分</div>
              <div class="stats-number">{{ courierStats.ratingStats.average }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快递员列表 -->
    <el-table :data="courierList" v-loading="loading" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="workId" label="工号" width="100"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="area" label="负责区域"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryCount" label="累计派送" width="100"></el-table-column>
      <el-table-column prop="rating" label="评分" width="100">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.rating"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column prop="joinDate" label="入职日期" width="120"></el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)" class="delete-btn">删除</el-button>
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

    <!-- 快递员表单对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="courierForm" :rules="rules" ref="courierForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="courierForm.name"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="workId">
          <el-input v-model="courierForm.workId"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="courierForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="负责区域" prop="area">
          <el-input v-model="courierForm.area"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="courierForm.status" style="width: 100%">
            <el-option label="在岗" value="在岗"></el-option>
            <el-option label="休假" value="休假"></el-option>
            <el-option label="离职" value="离职"></el-option>
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
  name: 'Courier',
  data() {
    return {
      searchForm: {
        keyword: '',
        status: ''
      },
      courierList: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      courierStats: {
        deliveryStats: {
          today: 0,
          week: 0,
          month: 0
        },
        ratingStats: {
          average: 0,
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0
        }
      },
      dialogVisible: false,
      dialogTitle: '',
      courierForm: {
        id: '',
        name: '',
        workId: '',
        phone: '',
        area: '',
        status: '在岗'
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        workId: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { pattern: /[A-Z]\d{5}/, message: '工号格式为1个大写字母+5位数字', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入负责区域', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchCourierList()
    this.fetchCourierStats()
  },
  methods: {
    getStatusType(status) {
      const types = {
        '在岗': 'success',
        '休假': 'warning',
        '离职': 'info'
      }
      return types[status] || 'info'
    },
    async fetchCourierList() {
      this.loading = true
      try {
        const res = await this.$axios.get('/api/courier/list', {
          params: {
            page: this.page.current,
            size: this.page.size,
            ...this.searchForm
          }
        })
        this.courierList = res.data.list
        this.page.total = res.data.total
      } catch (error) {
        console.error('获取快递员列表失败:', error)
        this.$message.error('获取快递员列表失败')
      }
      this.loading = false
    },
    async fetchCourierStats() {
      try {
        const res = await this.$axios.get('/api/courier/stats')
        this.courierStats = res.data
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    },
    handleSearch() {
      this.page.current = 1
      this.fetchCourierList()
    },
    handleSizeChange(val) {
      this.page.size = val
      this.fetchCourierList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchCourierList()
    },
    handleAdd() {
      this.dialogTitle = '新增快递员'
      this.courierForm = {
        id: '',
        name: '',
        workId: '',
        phone: '',
        area: '',
        status: '在岗'
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑快递员'
      this.courierForm = { ...row }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该快递员?', '提示', {
          type: 'warning'
        })
        await this.$axios.delete(`/api/courier/delete/${row.id}`)
        this.$message.success('删除成功')
        this.fetchCourierList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除快递员失败:', error)
          this.$message.error('删除快递员失败')
        }
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.courierForm.validate()
        if (this.courierForm.id) {
          await this.$axios.put('/api/courier/update', this.courierForm)
          this.$message.success('更新成功')
        } else {
          await this.$axios.post('/api/courier/add', this.courierForm)
          this.$message.success('添加成功')
        }
        this.dialogVisible = false
        this.fetchCourierList()
      } catch (error) {
        if (error !== false) {
          console.error('保存快递员失败:', error)
          this.$message.error('保存快递员失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.courier-container {
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

.el-rate {
  margin-top: 5px;
}
</style> 