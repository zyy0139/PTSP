<script setup>
import { ref,reactive, provide, onMounted} from 'vue'
import { ElMessage } from 'element-plus'
import { getListByCompanyId } from '@/apis/Recruit'
import recruitTable from '@/views/recruitManage/components/recruitTable.vue'
import addOrUpRecruitDrawer from '@/views/recruitManage/components/addOrUpRecruitDrawer.vue'

const recruitDataList = reactive([])
const recruitCount = ref(0)
const isLoading = ref(false)
const recruitId = ref('')

const drawerMessageData = reactive({
  career: '',
  type: '',
  number: '',
  message: '',
  salary: '',
  freefl: ''
})

provide('drawerMessageData', drawerMessageData)

const updateRecruitId = (id) => {
  recruitId.value = id
}

provide('recruitId', recruitId)
provide('updateRecruitId', updateRecruitId)

const updateLoading = (status) => {
  isLoading.value = status
}

provide('isLoading', isLoading)
provide('updateLoading', updateLoading)

const isShowDrawer = ref(false)
const drawerTitle = ref('')

const updateShowDrawer= (isDrawer) =>{
  isShowDrawer.value=isDrawer
}

provide('isShowDrawer', isShowDrawer)
provide('updateShowDrawer', updateShowDrawer)

const updateDrawerTitle= (Title) =>{
  drawerTitle.value=Title
}

provide('drawerTitle', drawerTitle)
provide('updateDrawerTitle', updateDrawerTitle)

function getRecruitList(params = {page: 1, pageSize: 5}){
  updateLoading(true)
  getListByCompanyId(params).then(res => {
    if (res.code === 200) {
      recruitCount.value=res.data.total
      recruitDataList.splice(0)
      recruitDataList.push(...res.data.recruitList)
      updateLoading(false)
    }else if(res.code === 406){
      ElMessage({
        type: 'info',
        message: '暂无招聘信息'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '获取招聘信息失败'
      })
    }
  })
  updateLoading(false)
}

onMounted(() => {
  getRecruitList()
})

function handleGetRecruitList(page) {
  getRecruitList(page)
}

function resetDrawerMessageData(){
  drawerMessageData.career = ''
  drawerMessageData.type = ''
  drawerMessageData.number = ''
  drawerMessageData.message = ''
  drawerMessageData.salary = ''
  drawerMessageData.freefl = ''
}

function handleAddRecruit(){
  updateShowDrawer(true)
  updateDrawerTitle('添加招聘信息')
  updateRecruitId('')
  resetDrawerMessageData()
}

</script>

<template>
  <div id="recruit">
    <div id="recruit-info">
      <div id="recruit-count">
        <span id="recruit-count-text">招聘信息数量(条):</span>
        <span>{{recruitCount}}</span>
      </div>
      <el-button id="add-recruit-btn" type="primary" @click="handleAddRecruit">添加招聘信息</el-button>
    </div>
    <add-or-up-recruit-drawer />
    <recruit-table
      :recruit-list="recruitDataList"
      :count="recruitCount"
      :is-loading="isLoading"
      @turn-page="handleGetRecruitList"
    />
  </div>
</template>

<style scoped>
#recruit-info{
  margin-bottom: 3em;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 8%;
  margin-right: 8%;
  padding: 2em 5em;
  border: #eeeeee 1px solid;
}
#add-recruit-btn{
  float: right;
}
#recruit-count{
  font-size: 1.5em;
  display: block;
  text-align: center;
}
#recruit-count-text{
  color: #747774;
}
</style>