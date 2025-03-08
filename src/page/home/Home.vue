<template>
  <div class="home-container">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :sm="12" :md="6" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newOrders')">
          <div class="card-panel-icon-wrapper icon-people">
            <i class="el-icon-s-order"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日订单</div>
            <count-to :start-val="0" :end-val="statistics.todayOrders" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <i class="el-icon-message"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">待处理反馈</div>
            <count-to :start-val="0" :end-val="statistics.pendingFeedback" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <i class="el-icon-user"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">活跃用户</div>
            <count-to :start-val="0" :end-val="statistics.activeUsers" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <i class="el-icon-location"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">取件点数量</div>
            <count-to :start-val="0" :end-val="statistics.deliveryPoints" :duration="3600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header" class="chart-header">
            <span>订单统计</span>
            <el-radio-group v-model="chartData.dateType" size="small">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="year">本年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container">
            <div ref="orderChart" style="width: 100%; height: 350px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header" class="chart-header">
            <span>快递员业绩排行</span>
            <el-button type="text">查看全部</el-button>
          </div>
          <el-table :data="courierRanking" style="width: 100%" :show-header="false">
            <el-table-column width="50">
              <template slot-scope="scope">
                <div :class="['ranking', scope.$index + 1 <= 3 ? 'top-' + (scope.$index + 1) : '']">
                  {{ scope.$index + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div class="courier-info">
                  <span class="courier-name">{{ scope.row.name }}</span>
                  <el-progress 
                    :percentage="scope.row.completion" 
                    :color="customColors"
                    :show-text="false"
                    style="width: 100px; margin: 0 20px;"/>
                  <span class="completion-rate">{{ scope.row.completion }}%</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            <span>最近活动</span>
            <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
          </div>
          <div class="activity-timeline">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :type="activity.type"
                :color="activity.color"
                :timestamp="activity.timestamp">
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import CountTo from 'vue-count-to'

export default {
  name: 'Home',
  components: {
    CountTo
  },
  data() {
    return {
      chartData: {
        dateType: 'week'
      },
      statistics: {
        todayOrders: 0,
        pendingFeedback: 0,
        activeUsers: 0,
        deliveryPoints: 0
      },
      courierRanking: [],
      activities: [],
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ]
    }
  },
  created() {
    // 在组件创建时就开始获取数据
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        // 获取统计数据
        const statsRes = await this.$axios.get('/api/home/statistics')
        this.statistics = statsRes.data

        // 获取订单数据
        const orderRes = await this.$axios.get('/api/home/orderData')
        this.initChart(orderRes.data[this.chartData.dateType])

        // 获取快递员排行
        const rankingRes = await this.$axios.get('/api/home/courierRanking')
        this.courierRanking = rankingRes.data.list

        // 获取最近活动
        const activitiesRes = await this.$axios.get('/api/home/recentActivities')
        this.activities = activitiesRes.data.list
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    },
    initChart(data) {
      const chartDom = this.$refs.orderChart
      const myChart = echarts.init(chartDom)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data.data,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            color: '#409EFF'
          }
        }]
      }
      myChart.setOption(option)

      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  },
  watch: {
    'chartData.dateType': {
      handler(newType) {
        this.$axios.get('/api/home/orderData').then(res => {
          this.initChart(res.data[newType])
        })
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.panel-group {
  margin-top: 18px;
}

.card-panel-col {
  margin-bottom: 20px;
}

.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);
  border-radius: 6px;
  
  &:hover {
    .card-panel-icon-wrapper {
      background: #409EFF;
    }
    .icon-people {
      background: #40c9c6;
    }
    .icon-message {
      background: #36a3f7;
    }
    .icon-money {
      background: #f4516c;
    }
    .icon-shopping {
      background: #34bfa3;
    }
  }
}

.card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
}

.card-panel-icon {
  float: left;
  font-size: 48px;
}

.card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
}

.card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel-num {
  font-size: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.courier-info {
  display: flex;
  align-items: center;
}

.courier-name {
  width: 80px;
}

.completion-rate {
  width: 50px;
  text-align: right;
}

.ranking {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background: #f0f2f5;
}

.top-1 {
  background: #f56c6c;
  color: white;
}

.top-2 {
  background: #e6a23c;
  color: white;
}

.top-3 {
  background: #5cb87a;
  color: white;
}

.activity-timeline {
  padding: 0 20px;
}

/* 图标颜色 */
.icon-people {
  color: #40c9c6;
}

.icon-message {
  color: #36a3f7;
}

.icon-money {
  color: #f4516c;
}

.icon-shopping {
  color: #34bfa3;
}

/* Element UI 覆盖样式 */
.el-card {
  border-radius: 6px;
}

.el-card__header {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f2f5;
}

.el-timeline-item {
  padding-bottom: 20px;
}

.chart {
  height: 350px;
}
</style>
