<script setup>
import resumeLineChart from '@/views/home/companyHome/components/resumeLineChart.vue'
import resumePieChart from '@/views/home/companyHome/components/resumePieChart.vue'
import todayRecommendTable from '@/views/home/companyHome/components/todayRecommendTable.vue'
import { ref,reactive,onMounted,provide } from 'vue'
import { getCountByDate } from '@/apis/Delivery'
import { getResumeList, getByTodayRecommend } from '@/apis/Resume'
import { formatDate } from '@/utils/formatDate'
import { getListByCompanyId } from '@/apis/Recruit'
import router from '@/router/index'

const todaySendCount = ref(0)
const yesterdaySendCount = ref(0)
const weekSendCount = ref(0)
const allSendCount = ref(0)
const recruitCount = ref(0)
const start = formatDate(new Date((Date.now() - 3600 * 1000 * 24 * 7)), 'YY-MM-DD')
const end = formatDate(new Date(Date.now()), 'YY-MM-DD')
const recommendCount = ref(0)
const resumeDateList = reactive([])

onMounted(() => {
  getCountByDate({ start: start, end: end }).then( res => {
    if (res.code === 200) {
      todaySendCount.value = res.data[7].newCount
      yesterdaySendCount.value = res.data[6].newCount
      weekSendCount.value = res.data[0].allCount
    }
  })
  getResumeList({ page: 1, pageSize: 5 }).then( res => {
    if (res.code === 200) {
      allSendCount.value = res.data.total
    }
  })
  getListByCompanyId({page: 1, pageSize: 5}).then( res => {
    if(res.code === 200){
      recruitCount.value = res.data.total
    }
  })
  getByTodayRecommend().then( res => {
    if(res.code === 200){
      recommendCount.value = res.data.total
      resumeDateList.splice(0)
      resumeDateList.push(...res.data.resumeList)
    }
  })
})

function handleRouter(status){
  if(status === 'resume'){
    router.push('resumeManage')
  }else {
    router.push('recruitManage')
  }
}

const isLoading = ref(false)
const updateLoading = (status) => {
  isLoading.value = status
}

provide('isLoading', isLoading)
provide('updateLoading', updateLoading)

const resumeId = ref(null)
const updateResumeId = (status) => {
  resumeId.value = status
}

provide('resumeId', resumeId)
provide('updateResumeId', updateResumeId)

const isShowDialog = ref(false)
const updateShowDialog = (status) => {
  isShowDialog.value = status
}

provide('isShowDialog', isShowDialog)
provide('updateShowDialog', updateShowDialog)

</script>

<template>
  <el-card class="resume-count-card">
    <span class="count-text">简历待处理数：{{allSendCount}}条</span>
    <el-button class="resume-btn" type="primary" @click="handleRouter(resume)">管理简历</el-button>
  </el-card>
  <el-card class="recruit-count-card">
    <span class="count-text">招聘信息数：{{recruitCount}}条</span>
    <el-button class="recruit-btn" type="primary" @click="handleRouter(recruit)">管理招聘信息</el-button>
  </el-card>
  <el-row>
    <el-col :span="16">
      <el-card class="today-recommend-card">
        <span class="recommend-title">今日推荐</span>
        <el-empty v-show="recommendCount === 0" description="今日暂无推荐简历" image-size="100px" />
        <today-recommend-table v-show="recommendCount > 0" :resume-list="resumeDateList" :count="recommendCount" />
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="statistics-card">
        <span class="chart-title">简历投递情况统计</span>
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
              <el-statistic title="总计数目" :value="allSendCount" />
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="chart-row">
    <el-col :span="16">
      <el-card class="resume-line-card">
        <resume-line-chart class="resume-line-chart" />
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="resume-pie-card">
        <resume-pie-chart class="resume-pie-chart" />
      </el-card>
    </el-col>
  </el-row>

</template>

<style scoped>
.chart-title {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
.count-statistic {
  margin-top: 20px;
}
.count-statistic .top-row{
  margin-top: 30px;
}
.count-statistic .footer-row{
  margin-top: 30px;
}
.count-statistic .el-col{
  text-align: center;
}
.resume-line-chart {
  width: 100%;
  height: 300px;
  flex: 1;
}
.resume-pie-chart {
  width: 100%;
  height: 300px;
  flex: 1;
}
.count-text{
  font-size: 18px;
}
.resume-btn{
  margin-left: 80%;
}
.recruit-btn{
  margin-left: 80%;
}
.resume-count-card{
  margin-top: 20px;
}
.recruit-count-card{
  margin-top: 20px;
}
.today-recommend-card{
  margin-top: 20px;
  height: 300px;
}
.recommend-title{
  font-size: 18px;
  display: flex;
  justify-content: center;
}
.statistics-card{
  margin-top: 20px;
  height: 300px;
}
.resume-line-card{
  margin-top: 20px;
}
.resume-pie-card{
  margin-top: 20px;
}
</style>