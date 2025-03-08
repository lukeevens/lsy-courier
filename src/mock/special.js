import Mock from 'mockjs'

const Random = Mock.Random

// 温度监控页面数据
const getSpecialPackages = Mock.mock({
    'code': 200,
    'data': {
        'stats': {
            'abnormalCount|5-20': 1,
            'deadlineCount|3-15': 1,
            'monitoringCount|50-200': 1,
            'normalCount|100-500': 1
        },
        'total|20-100': 1,
        'list|10': [{
            'id|+1': 1,
            'trackingNumber': /SF\d{12}/,
            'currentTemp|0-30.1': 1,
            'requiredTempRange': function() {
                const min = Random.integer(0, 10)
                const max = min + Random.integer(5, 10)
                return `${min}°C ~ ${max}°C`
            },
            'deliveryDeadline': '@datetime("yyyy-MM-dd HH:mm:ss")',
            'isAbnormal': '@boolean',
            'status|1': ['正常', '异常', '即将到期'],
            'temperatureHistory': function() {
                const count = Random.integer(10, 20)
                const data = []
                for (let i = 0; i < count; i++) {
                    data.push({
                        time: Random.datetime('yyyy-MM-dd HH:mm:ss'),
                        temperature: Random.float(0, 30, 0, 1)
                    })
                }
                return data
            }
        }]
    }
})

// 异常包裹页面数据
const getAbnormalPackages = Mock.mock({
    'code': 200,
    'data': {
        'stats': {
            'temperatureAbnormal|10-30': 1,
            'deadlineAbnormal|5-20': 1,
            'pendingCount|8-25': 1
        },
        'total|20-100': 1,
        'list|10': [{
            'id|+1': 1,
            'trackingNumber': /SF\d{12}/,
            'abnormalType|1': ['temperature', 'deadline'],
            'abnormalValue': function() {
                return this.abnormalType === 'temperature' 
                    ? Random.float(30, 40, 0, 1) 
                    : Random.integer(24, 72)
            },
            'detectedTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
            'status|1': ['pending', 'processing', 'resolved'],
            'handler': function() {
                return this.status === 'pending' ? '' : '@cname'
            },
            'remark': function() {
                return this.status === 'pending' ? '' : '@cparagraph(1)'
            }
        }]
    }
})

// 温度历史记录
const getTemperatureHistory = Mock.mock({
    'code': 200,
    'data': {
        'packageInfo': {
            'id|1-100': 1,
            'trackingNumber': /SF\d{12}/,
            'requiredTempMin|0-10': 1,
            'requiredTempMax|15-25': 1
        },
        'records|24': [{
            'temperature|0-30.1': 1,
            'recordTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
            'isAbnormal': '@boolean'
        }]
    }
})

// 设置接口
Mock.mock(RegExp('/api/packages/special.*'), 'get', getSpecialPackages)
Mock.mock(RegExp('/api/packages/abnormal.*'), 'get', getAbnormalPackages)
Mock.mock(RegExp('/api/packages/\\d+/temperature/history'), 'get', getTemperatureHistory)

// 处理异常
Mock.mock(RegExp('/api/packages/\\d+/abnormal/resolve'), 'put', {
    'code': 200,
    'message': '处理成功'
})

// 发送通知
Mock.mock(RegExp('/api/packages/\\d+/notify'), 'post', {
    'code': 200,
    'message': '通知发送成功',
    'data': {
        'notificationId': '@guid',
        'sentTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
    }
}) 