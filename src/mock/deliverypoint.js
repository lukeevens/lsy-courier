import Mock from 'mockjs'

// 取件点列表数据
const getDeliveryPointList = Mock.mock({
  'total': '@integer(50, 200)',
  'list|10': [{
    'id|+1': 1,
    'name': '@cword(4,8)快递站',
    'address': '@county(true)',
    'manager': '@cname',
    'phone': /^1[3456789]\d{9}$/,
    'capacity|50-200': 1,
    'used|0-100': 1,
    'status|1': ['正常运营', '暂停服务', '已关闭'],
    'openTime': '08:00-22:00',
    'createTime': '@datetime("yyyy-MM-dd")'
  }]
})

// 设置接口
Mock.mock(RegExp('/api/deliverypoint/list.*'), 'get', (options) => {
  return getDeliveryPointList
})

Mock.mock('/api/deliverypoint/add', 'post', {
  code: 200,
  message: '添加成功'
})

Mock.mock('/api/deliverypoint/update', 'put', {
  code: 200,
  message: '更新成功'
})

Mock.mock(RegExp('/api/deliverypoint/delete.*'), 'delete', {
  code: 200,
  message: '删除成功'
}) 