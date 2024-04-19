<script setup>
import echarts from '@/utils/echarts'
import { ref, defineProps, onMounted, watch } from 'vue'
import { formatDate } from '@/utils/formatDate'
import { getCountByDate } from '@/apis/Delivery'

const chartTitle = ref('每日投递情况统计')
const isLoading = ref(false)
const updateLoading = (status) => {
  isLoading.value = status
}

const start = (Date.now() - 3600 * 1000 * 24 * 7)
const end = Date.now()

const params = {
  start: formatDate(new Date(start), 'YY-MM-DD'),
  end: formatDate(new Date(end), 'YY-MM-DD')
}

function initChart(chart) {
  updateLoading(true)
  const option = {
    title: {
      text: chartTitle.value
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    animation: true,
    xAxis: {
      type: 'category',
      boundaryGap: false,
      name: '日期',
      data: [],
      nameTextStyle: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 15
      },
      axisLine: {
        symbol: ['none', 'arrow']
      }
    },
    yAxis: {
      type: 'value',
      name: '投递量(份)',
      nameTextStyle: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 15
      },
      axisLine: {
        symbol: ['none', 'arrow'],
        show: true
      }
    },
    series: [
      {
        data: [],
        name: '当日新增',
        type: 'line',
        symbolSize: 5,
        lineStyle: {
          width: 4
        },
        smooth: true
      }
    ]
  }
  getCountByDate(params).then( res => {
    option.xAxis.data = res.data.map(item => formatDate(new Date(item.date), 'MM-DD'))
    option.series[0].data = res.data.map(item => item.newCount)
    chart.setOption(option)
    updateLoading(false)
  })
}

const chart = ref(null)

onMounted(() => {
  const myChart = echarts.init(chart.value)
  initChart(myChart)
})

</script>

<template>
  <div v-loading="isLoading" ref="chart" />
</template>

<style scoped>

</style>