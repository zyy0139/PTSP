<script setup>
import { ref,reactive,provide,onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMessageList } from '@/apis/Recruit'
import recruitTable from '@/views/recruitList/recruitTable/index.vue'
import { pcaTextArr } from 'element-china-area-data'
import { getType } from "@/apis/WorkType";
import { getMessageBySearch } from '@/apis/Recruit'
import { formatDate } from '@/utils/formatDate'

const recruitDataList = reactive([])
const recruitCount = ref(0)
const islLoading = ref(false)
const isSearch = ref(false)
const searchData= reactive({
  address: '',
  releaseDate: '',
  type: ''
})
const options =reactive({
  typeList: [],
  addressList: []
})

getType().then(res => {
  if(res.code === 200){
    options.typeList = res.data.typeList
  }else {
    ElMessage({
      type: 'error',
      message: '获取岗位类型失败'
    })
  }
})

const updateLoading = (status) => {
  islLoading.value = status
}

provide('isLoading', islLoading)
provide('updateLoading', updateLoading)

function updateSearch(status){
  isSearch.value = status
}

function getRecruitList(params = {page: 1, pageSize: 5}) {
  updateLoading(true)
  updateSearch(false)
  getMessageList(params).then(res => {
    if (res.code === 200) {
      recruitCount.value = res.data.total
      recruitDataList.splice(0)
      recruitDataList.push(...res.data.recruitList)
      updateLoading(false)
    }else {
      ElMessage({
        type: 'error',
        message: '获取招聘信息失败'
      })
    }
  })
}

onMounted(() => {
  if(!isSearch){
    getRecruitListBySearch()
  }else {
    getRecruitList()
  }
})

function handleGetRecruitList(page) {
  console.log(isSearch.value)
  if(!isSearch){
    getRecruitListBySearch(page)
  }else {
    getRecruitList(page)
  }
}

const props= {
  checkStrictly: true
}

function getRecruitListBySearch(params = {page: 1, pageSize: 5}) {
  updateLoading(true)
  updateSearch(true)
  if(searchData.releaseDate){
    searchData.releaseDate=formatDate(new Date(searchData.releaseDate),'YY-MM-DD')
  }
  searchData.address=options.addressList.join('')
  getMessageBySearch({address: searchData.address, releaseDate: searchData.releaseDate, type: searchData.type,page: params.page, pageSize: params.pageSize}).then(res =>{
    if(res.code === 200){
      recruitCount.value = res.data.total
      recruitDataList.splice(0)
      recruitDataList.push(...res.data.recruitList)
      updateLoading(false)
    }else if(res.code === 406){
      ElMessage({
        type: 'info',
        message: '暂无符合条件的招聘信息'
      })
    } else {
      ElMessage({
        type: 'error',
        message: '获取招聘信息失败'
      })
    }
  })
}

function handleResetSearch(){
  options.addressList=[]
  searchData.releaseDate=''
  searchData.type=''
}

</script>

<template>
  <div class="recruit">
    <div id="recruit-search">
      <span>地区：</span>
      <el-cascader class="cascade-search"
        filterable
        clearable
        :props="props"
        :options="pcaTextArr"
        v-model="options.addressList"
      />
      <span class="text-search">发布时间：</span>
      <el-date-picker
        v-model="searchData.releaseDate"
        type="date"
        placeholder="请选择日期"
      />
      <span class="text-search">岗位类型：</span>
      <el-select v-model="searchData.type" class="select-search">
        <el-option
            v-for="type in options.typeList"
            :key="type"
            :label="type"
            :value="type">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getRecruitListBySearch({page: 1, pageSize: 5})">查询</el-button>
      <el-button type="primary" @click="handleResetSearch">重置</el-button>
      <span class="text-count">共{{recruitCount}}条招聘信息</span>
    </div>
    <recruit-table
      :recruit-list="recruitDataList"
      :count="recruitCount"
      :is-loading="islLoading"
      @turn-page="handleGetRecruitList"
    />
  </div>
</template>

<style scoped>
#recruit-search {
  margin-bottom: 20px;
}
.cascade-search {
  width: 30%;
  font-size: 14px;
}
.select-search {
  width: 10%;
  font-size: 14px;
  margin-right: 20px;
}
.text-search {
  margin-left: 10px;
}
.text-count{
  font-size: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>