<script setup>
import echarts from '@/utils/echarts'
import { ref,onMounted } from 'vue'
import { getCountByType } from '@/apis/Delivery'

const chartTitle = ref('岗位投递情况')

const isLoading = ref(true)
const updateLoading = (status) => {
  isLoading.value = status
}

function initChart(chart) {
  updateLoading(true)
  const option = {
    title: {
      text: chartTitle.value,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        name: '岗位投递数量',
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
  getCountByType().then( res => {
    option.series[0].data = res.data
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