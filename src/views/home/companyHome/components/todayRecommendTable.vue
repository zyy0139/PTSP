<script setup>
import { ref,inject,defineProps,reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatDate'
import { passDelivery, admitDelivery } from '@/apis/Delivery'
import { getResumeInfo } from '@/apis/Resume'

const props =defineProps({
  resumeList:{
    type:Array,
    default:()=>[]
  },
  count:{
    type:Number,
    default:0
  }
})

const isLoading = inject('isLoading')
const updateLoading = inject('updateLoading')
const updateShowDialog = inject('updateShowDialog')
const resumeId = inject('resumeId')
const updateResumeId = inject('updateResumeId')
const table = ref(null)
const userId =ref('')
const recruitId = ref('')

function getUserIdAndRecruitId(index) {
  userId.value = props.resumeList[index].userId
  recruitId.value = props.resumeList[index].recruitId
}

function handleAdmit() {
  updateLoading(true)
  admitDelivery({userId: userId.value, recruitId: recruitId.value}).then( res => {
    if(res.code === 200){
      ElMessage({
        type:'success',
        message: '录用成功'
      })
    }else if(res.code === 405 || res.code === 409 ){
      ElMessage({
        type: 'error',
        message: '服务器错误,请稍后再试'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '录用失败'
      })
    }
  })
  updateLoading(false)
  // window.location.reload()
}

function handlePass() {
  updateLoading(true)
  passDelivery({userId: userId.value, recruitId: recruitId.value}).then( res => {
    if(res.code === 200){
      ElMessage({
        type:'success',
        message: '驳回成功'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '驳回失败'
      })
    }
  })
  updateLoading(false)
  // window.location.reload()
}

const updateRecruitId = (status) => {
  recruitId.value = status
}

// const resumeMessage = reactive({
//   userName: '',
//   userSex: '',
//   userAge: '',
//   userAddress: '',
//   userSchool: '',
//   userPhone: '',
//   userProfession: '',
//   recruitName: '',
//   skill: '',
//   experience: '',
//   sendDate: ''
// })

const resumeMessage = inject('resumeMessage')

function handleGetMore(index){
  updateResumeId(props.resumeList[index].resumeId)
  updateRecruitId(props.resumeList[index].recruitId)
  getResumeInfo({resumeId: resumeId.value, recruitId: recruitId.value}).then( res => {
    if(res.code === 200){
      resumeMessage.userName = res.data.userName
      resumeMessage.userSex = res.data.userSex
      resumeMessage.userAge = res.data.userAge
      resumeMessage.userAddress = res.data.userAddress
      resumeMessage.userSchool = res.data.userSchool
      resumeMessage.userPhone = res.data.userPhone
      resumeMessage.userProfession = res.data.userProfession
      resumeMessage.recruitName = res.data.recruitName
      resumeMessage.skill = res.data.skill
      resumeMessage.experience = res.data.experience
      resumeMessage.sendDate = res.data.sendDate
    }
  })
  updateShowDialog(true)
}

</script>

<template>
  <div id="resume-table" v-loading="isLoading">
    <div id="resume-list">
      <el-table id="table-resume" ref="table" :data="props.resumeList" >
        <el-table-column prop="resumeId" label="简历Id" width="100" />
        <el-table-column prop="userName" label="姓名" width="100" />
        <el-table-column prop="recruitName" label="投递岗位" width="150" />
        <el-table-column prop="sendDate" label="投递日期" width="150">
          <template #default="{row}">
            {{formatDate(new Date(Date.parse(row.sendDate)),'YY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="handleGetMore(scope.$index)">详情</el-button>
            <el-popconfirm
                title="确认录用？"
                @confirm="handleAdmit"
                cancel-button-text="取消"
                confirm-button-text="确认"
                confirm-button-type="warning"
            >
              <template #reference>
                <el-button type="text" @click="getUserIdAndRecruitId(scope.$index)">录用</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
                title="确认驳回？"
                @confirm="handlePass"
                cancel-button-text="取消"
                confirm-button-text="确认"
                confirm-button-type="warning"
            >
              <template #reference>
                <el-button type="text" @click="getUserIdAndRecruitId(scope.$index)">驳回</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
#resume-table {
  background-color: #f5f5f5;
}
#resume-list {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>