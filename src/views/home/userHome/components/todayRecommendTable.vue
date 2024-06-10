<script setup>
import { ref,inject,defineProps,reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { addDelivery } from '@/apis/Delivery'
import { formatDate } from '@/utils/formatDate'
import { getMessageInfo } from '@/apis/Recruit'

const props = defineProps({
  recruitList:{
    type:Array,
    default:[]
  },
  count:{
    type:Number,
    default:0
  }
})

const isLoading = inject('isLoading')
const updateLoading = inject('updateLoading')
const recruitId = inject('recruitId')
const updateRecruitId = inject('updateRecruitId')
const updateShowDialog = inject('updateShowDialog')
const companyName = ref('')
const table = ref(null)

// const recruitMessage = reactive({
//   career: '',
//   companyName: '',
//   companyAddress: '',
//   number: '',
//   salary: '',
//   message: '',
//   companyPhone: '',
//   companyEmail: '',
//   freefl: '',
//   releaseDate: ''
// })
const recruitMessage = inject('recruitMessage')

function getRecruitIdAndCompanyName(index){
  updateRecruitId(props.recruitList[index].recruitId)
  companyName.value=props.recruitList[index].companyName
}

function handleAddDelivery(){
  updateLoading(true)
  addDelivery({recruitId: recruitId.value, companyName: companyName.value}).then(res => {
    if(res.code === 200){
      ElMessage({
        type:'success',
        message: '投递成功'
      })
    }else if(res.code === 421){
      ElMessage({
        type: 'warning',
        message: '该岗位已无空余名额'
      })
    }else if (res.code === 401){
      ElMessage({
        type: 'warning',
        message: '您已经投递过该岗位'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '投递失败'
      })
    }
  })
  updateLoading(false)
}

function handleGetMore(index){
  updateRecruitId(props.recruitList[index].recruitId)
  getMessageInfo({recruitId: recruitId.value}).then(res => {
    if(res.code === 200){
      recruitMessage.career = res.data.career
      recruitMessage.companyName = res.data.companyName
      recruitMessage.companyAddress = res.data.companyAddress
      recruitMessage.number = res.data.number
      recruitMessage.salary = res.data.salary
      recruitMessage.message = res.data.message
      recruitMessage.companyPhone = res.data.companyPhone
      recruitMessage.companyEmail = res.data.companyEmail
      recruitMessage.freefl = res.data.freefl
      recruitMessage.releaseDate = res.data.releaseDate
    }
  })
  updateShowDialog(true)
}

</script>

<template>
  <div id="recruit-table" v-loading="isLoading">
    <div id="recruit-list">
      <el-table id="table-recruit" ref="table" :data="props.recruitList" >
        <el-table-column prop="recruitId" label="招聘ID" width="100" />
        <el-table-column prop="companyName" label="公司名称" width="150" />
        <el-table-column prop="career" label="职位名称" width="150" />
        <el-table-column prop="releaseDate" label="发布时间" width="200" >
          <template #default="{row}">
            {{formatDate(new Date(Date.parse(row.releaseDate)),'YY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="handleGetMore(scope.$index)">查看详情</el-button>
            <el-popconfirm
                title="确认投递？"
                @confirm="handleAddDelivery"
                cancel-button-text="取消"
                confirm-button-text="确认"
                confirm-button-type="primary"
            >
              <template #reference>
                <el-button type="text" @click="getRecruitIdAndCompanyName(scope.$index)">投递简历</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
#recruit-table {
  background-color: #f5f5f5;
}
#recruit-list {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>