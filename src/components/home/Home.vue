<template>
    <div>
        <div class="chart-container" ref="lineChart"></div>
        <div class="info-container">
            <p>{{ currentDate }}</p>
            <p style="font-size: 18px;">欢迎来管理系统</p>
        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';

    export default {
        data() {
            return {
                currentDate: '',
            };
        },
        mounted() {
            this.initializeChart();
            this.updateDateTime();
            setInterval(() => {
                this.updateDateTime();
            }, 1000);
        },
        methods: {
            initializeChart() {
                this.lineChart = echarts.init(this.$refs.lineChart);
                this.lineChart.setOption({
                    title: {
                        text: '评价数据分析',
                        left: 'center', // 将标题居中
                    },
                    // 提示框
                    tooltip: {
                        trigger: 'axis',
                    },
                    // 图例
                    legend: {
                        icon: 'circle',
                        left: 'center',
                        top: 30,
                        data: ['好评', '一般', '差评'],
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    // 工具栏
                    toolbox: {
                        feature: {
                            saveAsImage: {
                                type: 'png',
                            },
                            magicType: {
                                type: ['line', 'bar', 'stack'],
                            },
                        },
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [
                        {
                            name: '好评',
                            type: 'line',
                            data: [120, 132, 101, 134, 190, 230, 210, 201, 234, 290, 230, 210],
                        },
                        {
                            name: '一般',
                            type: 'line',
                            data: [100, 82, 91, 54, 90, 76, 110, 81, 104, 90, 130, 110],
                        },
                        {
                            name: '差评',
                            type: 'line',
                            stack: '总量',
                            data: [10, 22, 21, 14, 19, 13, 20, 11, 34, 29, 20, 10],
                        },
                    ],
                });
            },
            updateDateTime() {
                const now = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
                this.currentDate = now.toLocaleDateString('zh-CN', options);
            },
        },
    };
</script>

<style scoped>
    .chart-container {
        width: 800px;
        height: 400px;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 20px;
        margin: 0 auto; /* 将图表居中 */
    }

    .info-container {
        text-align: center;
        margin-top: 20px;
    }

    .info-container p {
        margin: 5px 0;
        font-size: 14px;
        color: #666;
    }
</style>
