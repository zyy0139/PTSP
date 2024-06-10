<script setup>
import { ref,inject, defineProps, defineEmits, provide } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { passDelivery, admitDelivery } from '@/apis/Delivery'
import { formatDate } from '@/utils/formatDate'

const props = defineProps({
  resumeList: {
    type: Array,
    default: () => []
  },
  count: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['turnPage'])
const router = useRouter()
const isLoading = inject('isLoading')
const updateLoading = inject('updateLoading')
const table = ref(null)
const userId = ref('')
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

function handleExpand(row){
  table.value.toggleRowExpansion(row)
}

</script>

<template>
  <div class="resume-table" v-loading="isLoading">
    <div class="resume-list">
      <el-table class="table-resume" ref="table" :data="props.resumeList">
        <el-table-column type="expand" width="1">
          <template #default="scope">
            <div class="expand-text">
              <p>学生姓名: {{props.resumeList[scope.$index].userName}}</p>
              <p>性别: {{props.resumeList[scope.$index].userSex}}</p>
              <p>年龄: {{props.resumeList[scope.$index].userAge}}</p>
              <p>岗位意向: {{props.resumeList[scope.$index].career}}</p>
              <p>应聘岗位: {{props.resumeList[scope.$index].recruitName}}</p>
              <p>个人技能: {{props.resumeList[scope.$index].skill}}</p>
              <p>个人经历: {{props.resumeList[scope.$index].experience}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="学生ID" prop="userId" width="150" />
        <el-table-column label="学生姓名" prop="userName" width="150" />
        <el-table-column label="性别" prop="userSex" width="100" />
        <el-table-column label="年龄" prop="userAge" width="100" />
        <el-table-column label="学校" prop="userSchool" width="200" />
        <el-table-column label="专业" prop="userProfession" width="200" />
        <el-table-column label="应聘岗位" prop="recruitName" width="200" />
        <el-table-column label="投递时间" prop="sendDate" width="200" >
          <template #default="scope">
            {{formatDate(new Date(props.resumeList[scope.$index].sendDate), 'YY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="handleExpand(scope.row)">详情</el-button>
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
    <div class="pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="props.count"
          :page-size="5"
          hide-on-single-page
          @current-change="(page) => {emits('turnPage',{page: page, pageSize: 5})}"
      />
    </div>
  </div>
</template>

<style scoped>
.resume-table {
  background-color: #f5f5f5;
}
.resume-list {
  margin-top: 20px;
  margin-bottom: 20px;
}
.table-resume{
  width: auto;
}
.pagination{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.expand-text {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
}
</style>