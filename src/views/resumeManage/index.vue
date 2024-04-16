<script setup>
import { ref,reactive,provide,onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getResumeList,getResumeListBySearch } from '@/apis/Resume'
import resumeTable from "@/views/resumeManage/components/resumeTable.vue"
import { getCareerList } from '@/apis/Recruit'

const resumeDateList = reactive([])
const resumeCount = ref(0)
const isLoading = ref(false)
const isSearch = ref(false)

const updateLoading = (status) => {
  isLoading.value = status
}

const options = reactive({
  careerList: []
})

const searchData = reactive({
  career: ''
})

provide("isLoading", isLoading)
provide("updateLoading", updateLoading)

const updateSearch = (status) => {
  isSearch.value = status
}

function getList(params = {page: 1, pageSize: 5}){
  updateLoading(true)
  updateSearch(false)
  getResumeList(params).then(res => {
    if (res.code === 200) {
      resumeCount.value=res.data.total
      resumeDateList.splice(0)
      resumeDateList.push(...res.data.resumeList)
      updateLoading(false)
    }else if(res.code === 422){
      ElMessage({
        type: 'info',
        message: '暂无投递简历记录'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '获取简历列表失败'
      })
    }
  })
}

function getListBySearch(params = {page: 1, pageSize: 5}){
  updateLoading(true)
  updateSearch(true)
  getResumeListBySearch({career: searchData.career, page: params.page, pageSize: params.pageSize}).then(res => {
    if (res.code === 200) {
      resumeCount.value=res.data.total
      resumeDateList.splice(0)
      resumeDateList.push(...res.data.resumeList)
      updateLoading(false)
    }else if(res.code === 422){
      ElMessage({
        type: 'info',
        message: '暂无投递简历记录'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '获取简历列表失败'
      })
    }
  })
}

onMounted(() => {
  getList()
  getCareerList().then(res => {
    if (res.code === 200) {
      options.careerList = res.data.careerList
    }else {
      ElMessage({
        type: 'error',
        message: '获取岗位列表失败'
      })
    }
  })
})

function handleGetResumeList(page) {
  if (isSearch.value) {
    getListBySearch(page)
  }else {
    getList(page)
  }
}

function handleResetSearch() {
  searchData.career = ''
}


</script>

<template>
  <div class="resume">
    <div class="resume-search">
      <span>岗位：</span>
      <el-select v-model="searchData.career" class="select-search">
        <el-option
            v-for="career in options.careerList"
            :key="career"
            :label="career"
            :value="career">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getListBySearch({page: 1, pageSize: 5})">查询</el-button>
      <el-button type="primary" @click="handleResetSearch">重置</el-button>
      <div class="resume-count-info">
        <span>共有{{resumeCount}}个简历待处理</span>
      </div>
    </div>
    <resume-table
        :resume-list="resumeDateList"
        :count="resumeCount"
        :is-loading="isLoading"
        @turn-page="handleGetResumeList"
    />
  </div>
</template>

<style scoped>
.resume-search {
  margin-bottom: 20px;
}
.select-search {
  width: 30%;
  font-size: 14px;
  margin-right: 20px;
}
.resume-count-info {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>