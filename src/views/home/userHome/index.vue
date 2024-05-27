<script setup>
import recruitLineChart from '@/views/home/userHome/components/recruitLineChart.vue'
import recruitPieChart from '@/views/home/userHome/components/recruitPieChart.vue'
import todayRecommendTable from '@/views/home/userHome/components/todayRecommendTable.vue'
import { getAdmit } from '@/apis/User'
import { getCountByDate, getMessageList } from '@/apis/Recruit'
import { ref,reactive,onMounted,provide } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatDate'
import router from '@/router/index'
import { getByTodayRecommend } from '@/apis/Recruit'

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
const recommendCount = ref(0)
const isLoading = ref(false)
const recruitDataList = reactive([])

const updateLoading = (status) => {
  isLoading.value = status
}

provide('isLoading', isLoading)
provide('updateLoading', updateLoading)

const recruitId = ref(null)
const updateRecruitId = (status) => {
  recruitId.value = status
}

provide('recruitId', recruitId)
provide('updateRecruitId', updateRecruitId)

const isShowDialog = ref(false)
const updateShowDialog = (status) => {
  isShowDialog.value = status
}

provide('isShowDialog', isShowDialog)
provide('updateShowDialog', updateShowDialog)

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
  getByTodayRecommend().then( res => {
    if (res.code === 200) {
      recommendCount.value = res.data.total
      recruitDataList.splice(0)
      recruitDataList.push(...res.data.recruitList)
    }
  })
})

function handleRouter(status){
  if (status === 'company'){
    router.push('companyList')
  }else {
    router.push('recruitList')
  }
}

</script>

<template>
  <el-card class="user-admit-card">
    <span class="admit-text">录用状态:
      <template v-if="isAdmit">
        <span id="admit-true">{{admitMessage.true}}</span>
      </template>
      <template v-else>
        <span id="admit-false">{{admitMessage.false}}</span>
      </template>
    </span>
    <el-button class="admit-button" type="primary" @click="handleRouter('company')">查看公司信息</el-button>
    <el-button type="primary" @click="handleRouter('recruit')">查看岗位信息</el-button>
  </el-card>
  <el-row>
    <el-col :span="16">
      <el-card class="today-recommend-card">
        <span class="recommend-title">今日岗位推荐</span>
        <el-empty v-show="recommendCount === 0" description="今日暂无推荐岗位" image-size="100px" />
        <today-recommend-table v-show="recommendCount > 0" :recruit-list="recruitDataList" :count="recommendCount" />
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="statistics-card">
        <span class="chart-title">兼职市场统计</span>
        <div class="count-statistic">
          <el-row class="top-row">
            <el-col :span="12">
              <el-statistic title="昨日新增" :value="yesterdaySendCount" />
            </el-col>
            <el-col :span="12">
              <el-statistic title="今日新增" :value="todaySendCount" />
            </el-col>
          </el-row>
          <el-row class="footer-row">
            <el-col :span="12">
              <el-statistic title="本周新增" :value="weekSendCount" />
            </el-col>
            <el-col :span="12">
              <el-statistic title="总计数目" :value="allSendCount"  />
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="chart-row">
    <el-col :span="16">
      <el-card class="recruit-line-card">
        <recruit-line-chart class="recruit-line-chart" />
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="recruit-pie-card">
        <recruit-pie-chart class="recruit-pie-chart" />
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.recruit-line-chart {
  width: 100%;
  height: 300px;
  flex: 1;
}
.recruit-pie-chart {
  width: 100%;
  height: 300px;
  flex: 1;
}
.chart-title {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
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
.admit-text {
  font-size: 18px;
}
.user-admit-card {
  margin-top: 20px;
}
.statistics-card {
  margin-top: 10px;
  height: 300px;
}
.count-statistic .el-col{
  text-align: center;
}
.count-statistic .top-row{
  margin-top: 30px;
}
.count-statistic .footer-row{
  margin-top: 30px;
}
.today-recommend-card {
  margin-top: 10px;
  height: 300px;
}
.recommend-title {
  font-size: 18px;
  display: flex;
  justify-content: center;
}
.recruit-line-card {
  margin-top: 10px;
}
.recruit-pie-card {
  margin-top: 10px;
}
.admit-button {
  margin-left: 70%;
}
</style>