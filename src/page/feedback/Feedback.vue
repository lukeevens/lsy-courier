<template>
  <div class="feedback-container">
    <!-- 搜索和操作栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.keyword" placeholder="订单号/用户名/快递员" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.type" placeholder="评价类型" clearable>
            <el-option label="快递员评价" value="courier"></el-option>
            <el-option label="服务评价" value="service"></el-option>
            <el-option label="投诉建议" value="complaint"></el-option>
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
          <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 评价列表 -->
    <el-table :data="feedbackList" v-loading="loading" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="120"></el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeName(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户" width="100"></el-table-column>
      <el-table-column prop="courierName" label="快递员" width="100"></el-table-column>
      <el-table-column prop="rating" label="评分" width="120">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900">
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评价内容"></el-table-column>
      <el-table-column prop="createTime" label="评价时间" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ getStatusName(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="text" @click="handleReply(scope.row)" v-if="scope.row.status === 'pending'">回复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current"
        :page-sizes="[10, 20, 50, 100]" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

    <!-- 回复对话框 -->
    <el-dialog title="回复评价" :visible.sync="replyDialogVisible" width="500px">
      <el-form :model="replyForm" :rules="replyRules" ref="replyForm" label-width="80px">
        <el-form-item label="回复内容" prop="content">
          <el-input type="textarea" :rows="4" placeholder="请输入回复内容" v-model="replyForm.content">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitReply">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog title="评价详情" :visible.sync="detailDialogVisible" width="600px">
      <div v-if="currentFeedback" class="feedback-detail">
        <div class="detail-item">
          <span class="label">订单号：</span>
          <span>{{ currentFeedback.orderNo }}</span>
        </div>
        <div class="detail-item">
          <span class="label">评价类型：</span>
          <el-tag :type="getTypeTag(currentFeedback.type)">
            {{ getTypeName(currentFeedback.type) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">用户：</span>
          <span>{{ currentFeedback.userName }}</span>
        </div>
        <div class="detail-item">
          <span class="label">快递员：</span>
          <span>{{ currentFeedback.courierName }}</span>
        </div>
        <div class="detail-item">
          <span class="label">评分：</span>
          <el-rate v-model="currentFeedback.rating" disabled show-score text-color="#ff9900">
          </el-rate>
        </div>
        <div class="detail-item">
          <span class="label">评价内容：</span>
          <div class="content-box">{{ currentFeedback.content }}</div>
        </div>
        <div class="detail-item">
          <span class="label">评价时间：</span>
          <span>{{ currentFeedback.createTime }}</span>
        </div>
        <div class="detail-item" v-if="currentFeedback.reply">
          <span class="label">回复内容：</span>
          <div class="content-box">{{ currentFeedback.reply }}</div>
        </div>
        <div class="detail-item" v-if="currentFeedback.replyTime">
          <span class="label">回复时间：</span>
          <span>{{ currentFeedback.replyTime }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Feedback',
  data() {
    return {
      searchForm: {
        keyword: '',
        type: '',
        status: '',
        dateRange: []
      },
      feedbackList: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      replyDialogVisible: false,
      detailDialogVisible: false,
      currentFeedback: null,
      replyForm: {
        id: '',
        content: ''
      },
      replyRules: {
        content: [
          { required: true, message: '请输入回复内容', trigger: 'blur' },
          { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchFeedbackList()
  },
  methods: {
    getTypeTag(type) {
      const types = {
        courier: 'primary',
        service: 'success',
        complaint: 'warning'
      }
      return types[type] || 'info'
    },
    getTypeName(type) {
      const types = {
        courier: '快递员评价',
        service: '服务评价',
        complaint: '投诉建议'
      }
      return types[type] || '未知类型'
    },
    getStatusType(status) {
      const types = {
        pending: 'warning',
        processing: 'primary',
        resolved: 'success'
      }
      return types[status] || 'info'
    },
    getStatusName(status) {
      const types = {
        pending: '待处理',
        processing: '处理中',
        resolved: '已处理'
      }
      return types[status] || '未知状态'
    },
    async fetchFeedbackList() {
      this.loading = true
      try {
        const res = await this.$axios.get('/api/feedback/list', {
          params: {
            page: this.page.current,
            size: this.page.size,
            ...this.searchForm
          }
        })
        this.feedbackList = res.data.list
        this.page.total = res.data.total
      } catch (error) {
        console.error('获取评价列表失败:', error)
        this.$message.error('获取评价列表失败')
      }
      this.loading = false
    },
    handleSearch() {
      this.page.current = 1
      this.fetchFeedbackList()
    },
    handleSizeChange(val) {
      this.page.size = val
      this.fetchFeedbackList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchFeedbackList()
    },
    handleDetail(row) {
      this.currentFeedback = row
      this.detailDialogVisible = true
    },
    handleReply(row) {
      this.currentFeedback = row
      this.replyForm.id = row.id
      this.replyForm.content = ''
      this.replyDialogVisible = true
    },
    async submitReply() {
      try {
        await this.$refs.replyForm.validate()
        await this.$axios.post('/api/feedback/reply', this.replyForm)
        this.$message.success('回复成功')
        this.replyDialogVisible = false
        this.fetchFeedbackList()
      } catch (error) {
        if (error !== false) {
          console.error('回复失败:', error)
          this.$message.error('回复失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.feedback-container {
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

.feedback-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-item .label {
  font-weight: bold;
  margin-right: 10px;
  color: #606266;
}

.content-box {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.5;
}

.el-table {
  margin-top: 20px;
}

.el-rate {
  display: inline-block;
  vertical-align: text-bottom;
}
</style>