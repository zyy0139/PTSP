<script setup>
import recruitLineChart from '@/views/home/userHome/components/recruitLineChart.vue'
import recruitPieChart from '@/views/home/userHome/components/recruitPieChart.vue'
import { getAdmit } from '@/apis/User'
import { getCountByDate, getMessageList } from '@/apis/Recruit'
import { ref,reactive,onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatDate'

const isAdmit = ref(false)
const admitMessage = reactive({
  true: '已录用',
  false: '未录用'
})

const todaySendCount = ref(0)
const yesterdaySendCount = ref(0)
const weekSendCount = ref(0)
const allSendCount = ref(0)
const start = formatDate(new Date((Date.now() - 3600 * 1000 * 24 * 7)), 'YY-MM-DD')
const end = formatDate(new Date(Date.now()), 'YY-MM-DD')

onMounted(() => {
  getAdmit().then( res => {
    if (res.code === 200){
      isAdmit.value = res.data.isAdmit
    }else {
      ElMessage({
        type: 'error',
        message: '获取录用状态失败'
      })
    }
  })
  getCountByDate({ start: start, end: end }).then( res => {
    if (res.code === 200) {
      todaySendCount.value = res.data[7].newCount
      yesterdaySendCount.value = res.data[6].newCount
      weekSendCount.value = res.data[0].allCount
    }
  })
  getMessageList({ page: 1, pageSize: 5 }).then( res => {
    if (res.code === 200) {
      allSendCount.value = res.data.total
    }
  })
})

</script>

<template>
  <div class="user-admit">
    <span>录用状态:
      <template v-if="isAdmit">
        <span id="admit-true">{{admitMessage.true}}</span>
      </template>
      <template v-else>
        <span id="admit-false">{{admitMessage.false}}</span>
      </template>
    </span>
  </div>
  <div class="chart-section">
    <span class="chart-title">兼职市场统计</span>
    <div class="count-statistic">
      <el-row>
        <el-col :span="6">
          <el-statistic title="昨日新增" :value="yesterdaySendCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="今日新增" :value="todaySendCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="本周新增" :value="weekSendCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="总计数目" :value="allSendCount" />
        </el-col>
      </el-row>
    </div>
    <div class="recruit-chart">
      <recruit-line-chart class="recruit-line-chart" />
      <recruit-pie-chart class="recruit-pie-chart" />
    </div>
  </div>
</template>

<style scoped>
.user-admit {
  margin-bottom: 10px;
  font-size: 20px;
}
.recruit-chart {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.recruit-line-chart {
  width: 50%;
  height: 300px;
  flex: 1;
}
.recruit-pie-chart {
  width: 50%;
  height: 300px;
  flex: 1;
}
.chart-section {
  margin-top: 50px;
}
.chart-title {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
.el-col{
  text-align: center;
}
.count-statistic {
  margin-top: 20px;
}
#admit-true {
  color: green;
}

#admit-false {
  color: red;
}
</style>