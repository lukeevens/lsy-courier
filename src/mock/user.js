import Mock from 'mockjs'

const Random = Mock.Random

// 用户列表数据
const getUserList = Mock.mock({
  'total': '@integer(100, 200)',
  'list|10': [{
    'id|+1': 1,
    'username': '@word(5, 10)',
    'name': '@cname',
    'phone': /^1[3456789]\d{9}$/,
    'email': '@email',
    'address': '@county(true)',
    'registerTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'status|1': ['active', 'inactive'],
    'lastLoginTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
  }]
})

// 设置用户列表接口
Mock.mock(RegExp('/api/user/list.*'), 'get', (options) => {
  return getUserList
})

// 删除用户接口
Mock.mock(RegExp('/api/user/delete.*'), 'delete', {
  code: 200,
  message: '删除成功'
})

// 更新用户接口
Mock.mock('/api/user/update', 'put', {
  code: 200,
  message: '更新成功'
})

// 添加用户接口
Mock.mock('/api/user/add', 'post', {
  code: 200,
  message: '添加成功'
}) 