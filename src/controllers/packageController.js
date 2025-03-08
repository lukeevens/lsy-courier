const PackageService = require('../services/packageService');

class PackageController {
    // 更新包裹温度
    async updateTemperature(ctx) {
        const { id } = ctx.params;
        const { temperature, recordTime } = ctx.request.body;
        
        try {
            const result = await PackageService.updateTemperature(id, temperature, recordTime);
            
            // 检查是否需要发送温度异常通知
            if (result.isAbnormal) {
                await PackageService.sendTemperatureAlert(id, temperature);
            }
            
            ctx.body = {
                code: 200,
                message: 'success',
                data: result
            };
        } catch (error) {
            ctx.body = {
                code: 500,
                message: error.message
            };
        }
    }

    // 获取异常包裹
    async getAbnormalPackages(ctx) {
        const { type, page = 1, pageSize = 10 } = ctx.query;
        
        try {
            const result = await PackageService.getAbnormalPackages(type, page, pageSize);
            ctx.body = {
                code: 200,
                data: result
            };
        } catch (error) {
            ctx.body = {
                code: 500,
                message: error.message
            };
        }
    }

    // 通知收件人
    async notifyRecipient(ctx) {
        const { id } = ctx.params;
        const { notificationType, message } = ctx.request.body;
        
        try {
            const result = await PackageService.sendNotification(id, notificationType, message);
            ctx.body = {
                code: 200,
                message: '通知发送成功',
                data: result
            };
        } catch (error) {
            ctx.body = {
                code: 500,
                message: error.message
            };
        }
    }
}

module.exports = new PackageController(); 