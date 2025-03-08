import Mock from 'mockjs'

const Random = Mock.Random

// 订单列表数据
const getOrderList = Mock.mock({
  'total': '@integer(200, 1000)',
  'list|10': [{
    'id|+1': 1,
    'orderNo': /[A-Z]{2}\d{10}/,
    'trackingNumber': /SF\d{12}/,
    'senderName': '@cname',
    'senderPhone': /^1[3456789]\d{9}$/,
    'senderAddress': '@county(true)',
    'receiverName': '@cname',
    'receiverPhone': /^1[3456789]\d{9}$/,
    'receiverAddress': '@county(true)',
    'status|1': ['待取件', '运输中', '已送达', '已取件', '已取消'],
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'deliveryTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'amount': '@float(10, 1000, 2, 2)',
    'payStatus|1': ['已支付', '未支付'],
    'courierName': '@cname'
  }]
})

// 订单统计数据
const getOrderStats = Mock.mock({
  'total|10000-50000': 1,
  'today|100-500': 1,
  'pending|50-200': 1,
  'delivered|80-300': 1,
  'cancelled|0-50': 1,
  'income|50000-200000': 1
})

// 设置接口
Mock.mock(RegExp('/api/order/list.*'), 'get', (options) => {
  return getOrderList
})

Mock.mock('/api/order/stats', 'get', getOrderStats)

Mock.mock('/api/order/update', 'put', {
  code: 200,
  message: '更新成功'
})

Mock.mock(RegExp('/api/order/delete.*'), 'delete', {
  code: 200,
  message: '删除成功'
}) 