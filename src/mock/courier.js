import Mock from 'mockjs'

const Random = Mock.Random

// 快递员列表数据
const getCourierList = Mock.mock({
  'total': '@integer(50, 100)',
  'list|10': [{
    'id|+1': 1,
    'name': '@cname',
    'workId': /[A-Z]\d{5}/,
    'phone': /^1[3456789]\d{9}$/,
    'area': '@city',
    'status|1': ['在岗', '休假', '离职'],
    'joinDate': '@date("yyyy-MM-dd")',
    'deliveryCount|1000-5000': 1,
    'rating|4-5.1': 1,
    'avatar': Random.image('100x100', '#4A7BF7', 'Avatar')
  }]
})

// 快递员业绩统计
const getCourierStats = Mock.mock({
  'deliveryStats': {
    'today|50-200': 1,
    'week|300-1000': 1,
    'month|1000-5000': 1
  },
  'ratingStats': {
    'average|4-5.1': 1,
    'fiveStar|50-100': 1,
    'fourStar|20-50': 1,
    'threeStar|5-20': 1,
    'twoStar|0-5': 1,
    'oneStar|0-2': 1
  }
})

// 设置接口
Mock.mock(RegExp('/api/courier/list.*'), 'get', (options) => {
  return getCourierList
})

Mock.mock('/api/courier/stats', 'get', getCourierStats)

Mock.mock('/api/courier/add', 'post', {
  code: 200,
  message: '添加成功'
})

Mock.mock('/api/courier/update', 'put', {
  code: 200,
  message: '更新成功'
})

Mock.mock(RegExp('/api/courier/delete.*'), 'delete', {
  code: 200,
  message: '删除成功'
}) 