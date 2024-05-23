<script setup>
import { ref,reactive,inject,onMounted} from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { sendRecruit, updateRecruit} from '@/apis/Recruit'
import { getType } from "@/apis/WorkType";

const isShowDrawer = inject('isShowDrawer')
const updateShowDrawer = inject('updateShowDrawer')
const drawerTitle = inject('drawerTitle')
const form = ref(null)
const recruitId = inject('recruitId')
const drawerMessageData = inject('drawerMessageData')

const drawerMessage = reactive({
  career: drawerMessageData.career,
  type: drawerMessageData.type,
  number: drawerMessageData.number,
  message: drawerMessageData.message,
  salary: drawerMessageData.salary,
  freefl: drawerMessageData.freefl
})

const options = reactive({
  typeList: []
})

onMounted(() => {
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
})

const rules = {
  career: [
    { required: true, message: '请输入岗位名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择岗位类型', trigger: 'change' }
  ],
  freefl: [
    { required: true, message: '请选择是否管吃住', trigger: 'change' }
  ],
  number: [
    { required: true, message: '请输入招聘人数', trigger: 'blur' },
  ],
  salary: [
    { required: true, message: '请输入薪资待遇', trigger: 'blur' },
  ],
  message: [
    { required: true, message: '请输入岗位要求', trigger: 'blur' },
    { min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur' }
  ]
}

function handleSubmit(form){
  ElMessageBox.confirm(
      '确认提交吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true
      }
  ).then(() => {
    form.validate((valid) => {
      if (valid) {
        let num = parseInt(drawerMessage.number)
        let salaryNum = parseFloat(drawerMessage.salary)
        let isFreefl = Boolean(drawerMessage.freefl)
        if(!recruitId.value){
          sendRecruit({career: drawerMessage.career, type: drawerMessage.type,
            number: num, message: drawerMessage.message,
            salary: salaryNum, freefl: isFreefl})
              .then(res => {
                 if (res.code === 200) {
                   ElMessage({
                     type:'success',
                     message: '添加成功'
                   })
                 }else {
                   ElMessage({
                     type: 'error',
                     message: '添加失败'
                   })
                 }
              })
        }else {
          updateRecruit({recruitId: recruitId.value, career: drawerMessage.career, type: drawerMessage.type,
            number: num, message: drawerMessage.message,
            salary: salaryNum, freefl: isFreefl})
              .then(res => {
                 if (res.code === 200) {
                   ElMessage({
                     type:'success',
                     message: '修改成功'
                   })
                 }else {
                   ElMessage({
                     type: 'error',
                     message: '修改失败'
                   })
                 }
              })
        }
        updateShowDrawer(false)
        window.location.reload()
      }
    })
  })
}

</script>

<template>
  <el-drawer v-model="isShowDrawer" :direction="'rtl'">
    <template #header>
      <div id="title-text">
        <h2>{{drawerTitle}}</h2>
      </div>
    </template>
    <template #default>
      <div>
        <el-form ref="form" :model="drawerMessage" :label-position="'top'" :rules="rules">
          <el-form-item label="岗位名:" prop="career">
            <el-input v-model="drawerMessage.career" placeholder="请输入岗位名" />
          </el-form-item>
          <el-form-item label="岗位类型:" prop="type">
            <el-select v-model="drawerMessage.type">
              <el-option
                  v-for="type in options.typeList"
                  :key="type"
                  :label="type"
                  :value="type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="招聘人数:" prop="number">
            <el-input v-model="drawerMessage.number" placeholder="请输入招聘人数" />
          </el-form-item>
          <el-form-item label="薪资待遇:" prop="salary">
            <el-input v-model="drawerMessage.salary" placeholder="请输入薪资待遇" />
          </el-form-item>
          <el-form-item label="是否管吃住:" prop="freefl">
            <el-radio-group v-model="drawerMessage.freefl">
              <el-radio value="true">是</el-radio>
              <el-radio value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="岗位要求:" prop="message">
            <el-input type="textarea" v-model="drawerMessage.message" placeholder="请输入岗位要求" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div class="drawer-footer">
        <el-button type="primary" @click="handleSubmit(form)">提交</el-button>
        <el-button @click="updateShowDrawer(false)">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
#title-text{
  color: black;
  text-align: center;
}
.drawer-footer{
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
</style>