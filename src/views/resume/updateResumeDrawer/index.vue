<script setup>
import { ref,reactive,inject} from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { getUserMessage} from '@/apis/User'
import { getResume,updateResume,addResume } from '@/apis/Resume'
import { getType } from '@/apis/WorkType'

const isShowDrawer = inject('isShowDrawer')
const title = inject('drawerTitle')
const updateShowDrawer = inject('updateShowDrawer')
const updateResumeForm = ref(null)
const drawerAlert = inject('drawerAlert')
const alertTitle = ref('提示')
const isAddOrUpdate = inject('isAddOrUpdate')
const options =reactive({
  typeList: []
})

getType().then(res => {
  if(res.code === 200){
    options.typeList = res.data.typeList
  }else {
    ElMessage({
      type: 'error',
      message: '获取工作类型失败'
    })
  }
})

const updateResumeData = reactive({
  name: '',
  sex: '',
  age: '',
  email: '',
  phone: '',
  address: '',
  school: '',
  profession: '',
  career: '',
  type: '',
  skill: '',
  experience: ''
})

getUserMessage().then(res => {
  if(res.code === 200){
    updateResumeData.name = res.data.userName
    updateResumeData.sex =res.data.userSex
    updateResumeData.age = res.data.userAge
    updateResumeData.email = res.data.userEmail
    updateResumeData.phone = res.data.userPhone
    updateResumeData.address = res.data.userAddress
    updateResumeData.school = res.data.userSchool
    updateResumeData.profession = res.data.userProfession
  }else {
    ElMessage({
      type: 'warning',
      message: '请先完善个人的基本信息'
    })
  }
})

getResume().then(res =>{
  if(res.code === 200){
    updateResumeData.career = res.data.career
    updateResumeData.type = res.data.type
    updateResumeData.skill = res.data.skill
    updateResumeData.experience = res.data.experience
  }else {
    ElMessage({
      type: 'warning',
      message: '暂无简历数据'
    })
  }
})

//检测邮箱合法性
function checkEmail(rule,value,callback){
  if (!(/^[^@]+@[^@]+$/.test(value))) {
    return callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validate: checkEmail, message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      ,min:11, max:11, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
  ],
  school: [
    { required: true, message: '请输入学校', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  profession: [
    { required: true, message: '请输入所属专业', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  career: [
    { required: true, message: '请输入岗位意向', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择求职类型', trigger: 'change' }
  ],
  skill: [
    { required: true, message: '请输入技能描述', trigger: 'blur' },
    { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  experience: [
    { required: true, message: '请输入工作经验', trigger: 'blur' },
    { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
  ]
}

function handleUpdateResume(form) {
  ElMessageBox.confirm(
      drawerAlert.value,
      alertTitle.value,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true
      }
  ).then(() =>{
    form.validate((isValid) => {
      if (isValid) {
        if(isAddOrUpdate.value === 'add'){
          addResume({career: updateResumeData.career, type: updateResumeData.type,
            skill: updateResumeData.skill,experience: updateResumeData.experience})
              .then(res => {
                if (res.code === 200) {
                  ElMessage({
                    type: 'success',
                    message: '添加成功'
                  })
                  updateShowDrawer(false)
                  window.location.reload()
                }else {
                  ElMessage({
                    type: 'error',
                    message: '服务器错误,请稍后再试'
                  })
                }
              })
        }else{
          updateResume({career: updateResumeData.career, type: updateResumeData.type,
            skill: updateResumeData.skill,experience: updateResumeData.experience})
              .then(res =>{
                if(res.code === 200){
                  ElMessage({
                    type: 'success',
                    message: '修改成功'
                  })
                  updateShowDrawer(false)
                  window.location.reload()
                }else {
                  ElMessage({
                    type: 'error',
                    message: '服务器错误,请稍后再试'
                  })
                }
              })
        }
      }
    })
  }).catch(() =>{
    ElMessage({
      type: 'info',
      message: '已取消'
    })
  })
}

</script>

<template>
  <el-drawer v-model="isShowDrawer" :direction="'rtl'">
    <template #title>
      <div id="drawer-title">
        <h2>{{title}}</h2>
      </div>
    </template>
    <template #default>
      <div>
        <el-form ref="updateResumeForm" :model="updateResumeData" :label-position="'top'" :rules="rules">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="updateResumeData.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="updateResumeData.sex">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄:" prop="age">
            <el-select v-model="updateResumeData.age">
              <el-option
                  v-for="age in 100"
                  :key="age"
                  :label="age"
                  :value="String(age)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="updateResumeData.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="updateResumeData.phone"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="updateResumeData.address"></el-input>
          </el-form-item>
          <el-form-item label="学校" prop="school">
            <el-input v-model="updateResumeData.school"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="profession">
            <el-input v-model="updateResumeData.profession"></el-input>
          </el-form-item>
          <el-form-item label="岗位意向" prop="career">
            <el-input v-model="updateResumeData.career"></el-input>
          </el-form-item>
          <el-form-item label="求职类型" prop="type">
            <el-select v-model="updateResumeData.type">
              <el-option
                  v-for="type in options.typeList"
                  :key="type"
                  :label="type"
                  :value="type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="技能描述" prop="skill">
            <el-input type="textarea" v-model="updateResumeData.skill" maxlength="200" show-word-limit />
          </el-form-item>
          <el-form-item label="工作经验" prop="experience">
            <el-input type="textarea" v-model="updateResumeData.experience" maxlength="200" show-word-limit />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="handleUpdateResume(updateResumeForm)">确认</el-button>
        <el-button @click="updateShowDrawer(false)">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
#drawer-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  color: black;
}
</style>