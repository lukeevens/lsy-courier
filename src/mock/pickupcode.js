import Mock from 'mockjs'

const Random = Mock.Random

// 取件码列表数据
const getPickupCodeList = Mock.mock({
  'total': '@integer(100, 200)',
  'list|10': [{
    'id|+1': 1,
    'code': /[A-Z0-9]{6}/,
    'orderNo': /[A-Z]{2}\d{10}/,
    'receiverName': '@cname',
    'receiverPhone': /^1[3456789]\d{9}$/,
    'deliveryPoint': '@cword(4,8)快递站',
    'status|1': ['未使用', '已使用', '已过期'],
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'expireTime': function() {
      return Random.date('yyyy-MM-dd HH:mm:ss', Random.now('yyyy-MM-dd HH:mm:ss', '+7 days'))
    },
    'useTime': function() {
      return this.status === '已使用' ? '@datetime("yyyy-MM-dd HH:mm:ss")' : ''
    }
  }]
})

// 取件码统计数据
const getPickupCodeStats = Mock.mock({
  'total|1000-2000': 1,
  'unused|100-200': 1,
  'used|500-1000': 1,
  'expired|50-100': 1,
  'todayGenerated|50-100': 1,
  'todayUsed|30-80': 1
})

// 设置接口
Mock.mock(RegExp('/api/pickupcode/list.*'), 'get', (options) => {
  return getPickupCodeList
})

Mock.mock('/api/pickupcode/stats', 'get', getPickupCodeStats)

Mock.mock('/api/pickupcode/generate', 'post', {
  code: 200,
  message: '取件码生成成功',
  data: {
    code: Random.string('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
  }
})

Mock.mock(RegExp('/api/pickupcode/invalidate.*'), 'put', {
  code: 200,
  message: '取件码已作废'
}) 