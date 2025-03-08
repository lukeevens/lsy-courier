<template>
  <div class="pickup-code-container">
    <!-- 搜索和操作栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.keyword" placeholder="取件码/订单号/手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="状态" clearable>
            <el-option label="未使用" value="未使用"></el-option>
            <el-option label="已使用" value="已使用"></el-option>
            <el-option label="已过期" value="已过期"></el-option>
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
          <el-button type="success" @click="handleGenerate">生成取件码</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 取件码列表 -->
    <el-table :data="codeList" v-loading="loading" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="code" label="取件码" width="120">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.code }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="120"></el-table-column>
      <el-table-column prop="receiverName" label="收件人" width="100"></el-table-column>
      <el-table-column prop="receiverPhone" label="联系电话" width="120"></el-table-column>
      <el-table-column prop="deliveryPoint" label="取件点" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="生成时间" width="180"></el-table-column>
      <el-table-column prop="expireTime" label="过期时间" width="180"></el-table-column>
      <el-table-column prop="useTime" label="使用时间" width="180"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
          <el-button 
            type="text" 
            @click="handleInvalidate(scope.row)"
            v-if="scope.row.status === '未使用'">作废</el-button>
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

    <!-- 生成取件码对话框 -->
    <el-dialog title="生成取件码" :visible.sync="dialogVisible" width="500px">
      <el-form :model="codeForm" :rules="rules" ref="codeForm" label-width="100px">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="codeForm.orderNo"></el-input>
        </el-form-item>
        <el-form-item label="收件人" prop="receiverName">
          <el-input v-model="codeForm.receiverName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="receiverPhone">
          <el-input v-model="codeForm.receiverPhone"></el-input>
        </el-form-item>
        <el-form-item label="取件点" prop="deliveryPoint">
          <el-select v-model="codeForm.deliveryPoint" style="width: 100%">
            <el-option
              v-for="point in deliveryPoints"
              :key="point.id"
              :label="point.name"
              :value="point.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期" prop="validDays">
          <el-input-number 
            v-model="codeForm.validDays" 
            :min="1" 
            :max="7"
            style="width: 100%">
          </el-input-number>
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
  name: 'PickupCode',
  data() {
    return {
      searchForm: {
        keyword: '',
        status: '',
        dateRange: []
      },
      codeList: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      codeForm: {
        orderNo: '',
        receiverName: '',
        receiverPhone: '',
        deliveryPoint: '',
        validDays: 3
      },
      deliveryPoints: [], // 取件点列表
      rules: {
        orderNo: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
        ],
        receiverName: [
          { required: true, message: '请输入收件人姓名', trigger: 'blur' }
        ],
        receiverPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        deliveryPoint: [
          { required: true, message: '请选择取件点', trigger: 'change' }
        ],
        validDays: [
          { required: true, message: '请设置有效期', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchCodeList()
    this.fetchDeliveryPoints()
  },
  methods: {
    getStatusType(status) {
      const types = {
        '未使用': 'primary',
        '已使用': 'success',
        '已过期': 'info'
      }
      return types[status] || 'info'
    },
    async fetchCodeList() {
      this.loading = true
      try {
        const res = await this.$axios.get('/api/pickupcode/list', {
          params: {
            page: this.page.current,
            size: this.page.size,
            ...this.searchForm
          }
        })
        this.codeList = res.data.list
        this.page.total = res.data.total
      } catch (error) {
        console.error('获取取件码列表失败:', error)
        this.$message.error('获取取件码列表失败')
      }
      this.loading = false
    },
    async fetchDeliveryPoints() {
      try {
        const res = await this.$axios.get('/api/deliverypoint/list', {
          params: { status: '正常运营' }
        })
        this.deliveryPoints = res.data.list
      } catch (error) {
        console.error('获取取件点列表失败:', error)
      }
    },
    handleSearch() {
      this.page.current = 1
      this.fetchCodeList()
    },
    handleGenerate() {
      this.dialogVisible = true
    },
    handleSizeChange(val) {
      this.page.size = val
      this.fetchCodeList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchCodeList()
    },
    handleDetail(row) {
      // 实现查看详情逻辑
      console.log('查看取件码详情:', row)
    },
    async handleInvalidate(row) {
      try {
        await this.$confirm('确认作废该取件码?', '提示', {
          type: 'warning'
        })
        await this.$axios.put(`/api/pickupcode/invalidate/${row.id}`)
        this.$message.success('取件码已作废')
        this.fetchCodeList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('作废取件码失败:', error)
          this.$message.error('作废取件码失败')
        }
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.codeForm.validate()
        await this.$axios.post('/api/pickupcode/generate', this.codeForm)
        this.$message.success('取件码生成成功')
        this.dialogVisible = false
        this.fetchCodeList()
      } catch (error) {
        if (error !== false) {
          console.error('生成取件码失败:', error)
          this.$message.error('生成取件码失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.pickup-code-container {
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

.el-table {
  margin-top: 20px;
}
</style> 