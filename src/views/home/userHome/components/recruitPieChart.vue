<script setup>
import echarts from '@/utils/echarts'
import { ref, defineProps, onMounted, watch } from 'vue'
import { getCountByType } from '@/apis/Recruit'

const props = defineProps({
  chartTitle: {
    type: String,
    default: '市场岗位类型分布'
  }
})

const isLoading = ref(false)
const updateLoading = (status) => {
  isLoading.value = status
}

const chart = ref(null)

function initChart(chart) {
  updateLoading(true)
  const option = {
    title: {
      text: props.chartTitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        name: '该类型数量',
        radius: '50%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  getCountByType().then(res => {
    option.series[0].data = res.data
    chart.setOption(option)
    updateLoading(false)
  })
}

let myChart
onMounted(() => {
  myChart = echarts.init(chart.value)
  initChart(myChart)
})

</script>

<template>
  <div ref="chart" v-loading="isLoading" />
</template>

<style scoped>

</style>