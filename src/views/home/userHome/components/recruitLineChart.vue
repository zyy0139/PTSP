<script setup>
import echarts from '@/utils/echarts'
import { ref, defineProps, onMounted, watch } from 'vue'
import { formatDate } from '@/utils/formatDate'
import { getCountByDate } from '@/apis/Recruit'

const props = defineProps({
  chartTitle: {
    type: String,
    default: '每日新增统计'
  }
})

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

const chart = ref(null)

function updateChart(title, chart){
  updateLoading(true)
  const option = {
    title: {
      text: title
    },
    xAxis : {
      data: []
    },
    yAxis : {
      type: 'value'
    },
    series: [
      {
        name: '当日新增',
        type: 'line',
        data: []
      }
    ]
  }
  getCountByDate(params).then( res => {
    option.xAxis.data = res.data.map(item => formatDate(item.date, 'MM-DD'))
    option.series[0].data = res.data.map(item => item.newCount)
    chart.setOption(option)
    updateLoading(false)
  })
}

let myChart
onMounted(() => {
  myChart = echarts.init(chart.value)
  initChart(myChart)
})
watch(
    () => props.chartTitle,
    () => {
    updateChart(props.chartTitle, myChart)
  }
)

function initChart(chart){
  updateLoading(true)
  const option = {
    title: {
      text: props.chartTitle
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
      name: '信息量(条)',
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
        LineStyle: {
          width: 4
        },
        smooth: true
      }
    ]
  }
  getCountByDate(params).then( res => {
    option.xAxis.data = res.data.map(item => formatDate(item.date, 'MM-DD'))
    option.series[0].data = res.data.map(item => item.newCount)
    chart.setOption(option)
    updateLoading(false)
  })
}

</script>

<template>
  <div ref="chart" v-loading="isLoading" />
</template>

<style scoped>

</style>