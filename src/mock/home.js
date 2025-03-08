import Mock from 'mockjs'

const Random = Mock.Random

// 统计数据
const getStatistics = {
  todayOrders: Mock.mock('@integer(50, 200)'),
  pendingFeedback: Mock.mock('@integer(30, 100)'),
  activeUsers: Mock.mock('@integer(8000, 10000)'),
  deliveryPoints: Mock.mock('@integer(12000, 15000)')
}

// 订单统计数据
const getOrderData = {
  week: {
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    data: Mock.mock({
      'list|7': ['@integer(50, 200)']
    }).list
  },
  month: {
    xAxis: Array.from({length: 30}, (_, i) => `${i + 1}日`),
    data: Mock.mock({
      'list|30': ['@integer(30, 300)']
    }).list
  },
  year: {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    data: Mock.mock({
      'list|12': ['@integer(500, 3000)']
    }).list
  }
}

// 快递员排行
const getCourierRanking = Mock.mock({
  'list|10': [{
    'name': '@cname',
    'completion|70-100': 1,
    'deliveries|100-1000': 1
  }]
})

// 最近活动
const getRecentActivities = Mock.mock({
  'list|8': [{
    'content': function() {
      const actions = ['完成了派送任务', '加入了团队', '收到了表扬', '完成了培训']
      const action = Random.pick(actions)
      if (action === '完成了派送任务') {
        return `快递员${Random.cname()}${action}${Random.integer(50, 200)}单`
      }
      return `快递员${Random.cname()}${action}`
    },
    'timestamp': '@datetime("MM-dd HH:mm")',
    'type|1': ['success', 'info', 'warning', 'primary'],
    'color': function() {
      const colors = {
        'success': '#0bbd87',
        'info': '#409EFF',
        'warning': '#e6a23c',
        'primary': '#409EFF'
      }
      return colors[this.type]
    }
  }]
})

// 设置接口
Mock.mock('/api/home/statistics', 'get', getStatistics)
Mock.mock('/api/home/orderData', 'get', getOrderData)
Mock.mock('/api/home/courierRanking', 'get', getCourierRanking)
Mock.mock('/api/home/recentActivities', 'get', getRecentActivities) 