const schedule = require('node-schedule');
const PackageService = require('../services/packageService');

// 每5分钟检查一次温度异常
schedule.scheduleJob('*/5 * * * *', async () => {
    try {
        const abnormalPackages = await PackageService.checkTemperatureAbnormal();
        
        for (const pkg of abnormalPackages) {
            await PackageService.sendTemperatureAlert(pkg.id, pkg.currentTemp);
        }
    } catch (error) {
        console.error('Temperature monitoring task error:', error);
    }
});

// 每小时检查一次即将到期的包裹
schedule.scheduleJob('0 * * * *', async () => {
    try {
        const deadlinePackages = await PackageService.checkDeliveryDeadline();
        
        for (const pkg of deadlinePackages) {
            await PackageService.sendDeadlineAlert(pkg.id);
        }
    } catch (error) {
        console.error('Deadline monitoring task error:', error);
    }
}); 