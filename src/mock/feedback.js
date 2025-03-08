import Mock from 'mockjs'

const Random = Mock.Random

// 评价列表数据
const getFeedbackList = Mock.mock({
  'total': '@integer(100, 200)',
  'list|10': [{
    'id|+1': 1,
    'orderNo': /[A-Z]{2}\d{10}/,
    'type|1': ['courier', 'service', 'complaint'],
    'userName': '@cname',
    'courierName': '@cname',
    'rating|1-5': 1,
    'content': '@cparagraph(1, 3)',
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'status|1': ['pending', 'processing', 'resolved'],
    'reply': function() {
      return this.status === 'resolved' ? '@cparagraph(1)' : ''
    },
    'replyTime': function() {
      return this.reply ? '@datetime("yyyy-MM-dd HH:mm:ss")' : ''
    }
  }]
})

// 评价统计数据
const getFeedbackStats = Mock.mock({
  'total|1000-2000': 1,
  'pending|50-100': 1,
  'processing|20-50': 1,
  'resolved|500-1000': 1,
  'ratingStats': {
    'average|4-5.1': 1,
    'fiveStar|100-200': 1,
    'fourStar|50-100': 1,
    'threeStar|20-50': 1,
    'twoStar|5-20': 1,
    'oneStar|0-5': 1
  },
  'typeStats': {
    'courier|200-500': 1,
    'service|100-300': 1,
    'complaint|50-100': 1
  }
})

// 设置接口
Mock.mock(RegExp('/api/feedback/list.*'), 'get', (options) => {
  return getFeedbackList
})

Mock.mock('/api/feedback/stats', 'get', getFeedbackStats)

Mock.mock('/api/feedback/reply', 'post', {
  code: 200,
  message: '回复成功'
}) 