<script setup>
import { ref,reactive,provide } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { getUserMessage } from '@/apis/User'
import { getResume } from '@/apis/Resume'
import { ElMessage } from 'element-plus'
import updateResumeDrawer  from '@/views/resume/updateResumeDrawer/index.vue'

const userResumeForm = ref(null)
const router = useRouter()
const route = useRoute()
const title = ref('')
const nullMsg = ref('系统并未收录您的简历信息，快去添加简历吧！')
const isMsgNull = ref(true)
const isShowDrawer = ref(false)
const drawerTitle = ref('')
const drawerAlert = ref('')
const isAddOrUpdate = ref('add')
title.value = route.meta.title

const userResumeData = reactive({
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

provide('userResumeData', userResumeData)

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

const updateDrawerAlert= (Alert) =>{
  drawerAlert.value=Alert
}

provide('drawerAlert', drawerAlert)
provide('updateDrawerAlert', updateDrawerAlert)

const updateIsAddOrUpdate= (isAdd) =>{
  isAddOrUpdate.value=isAdd
}

provide('isAddOrUpdate', isAddOrUpdate)
provide('updateIsAddOrUpdate', updateIsAddOrUpdate)

function addResume() {
  updateShowDrawer(true)
  updateDrawerTitle("添加简历")
  updateDrawerAlert("请确认简历信息填写无误")
  updateIsAddOrUpdate('add')
}

function updateUserResume() {
  updateShowDrawer(true)
  updateDrawerTitle('修改简历')
  updateDrawerAlert('请确认需要修改简历')
  updateIsAddOrUpdate('update')
}

getResume().then(res => {
  if(res.code === 200){
    userResumeData.career=res.data.career
    userResumeData.type=res.data.type
    userResumeData.skill=res.data.skill
    userResumeData.experience=res.data.experience
    isMsgNull.value=false
  }else {
    ElMessage({
      type: 'info',
      message: '系统暂未收录您的简历'
    })
  }
})

getUserMessage().then(res => {
  if(res.code === 200){
    userResumeData.name=res.data.userName
    userResumeData.sex=res.data.userSex
    userResumeData.age=res.data.userAge
    userResumeData.email=res.data.userEmail
    userResumeData.phone=res.data.userPhone
    userResumeData.address=res.data.userAddress
    userResumeData.school=res.data.userSchool
    userResumeData.profession=res.data.userProfession
  }else{
    ElMessage({
      type: 'info',
      message: '系统暂未收录您的信息,请先完善个人信息'
    })
  }
})

</script>

<template>
  <div id="form-content">
    <template v-if="isMsgNull">
      <div id="null-alert">
        <span id="null-msg">{{ nullMsg }}</span>
        <el-button text id="text-update" @click="addResume">
          <span>点击此处添加简历</span>
        </el-button>
      </div>
    </template>
    <template v-else>
      <el-form ref="userResumeForm" :model="userResumeData" label-width="auto" label-position="left">
        <span id="form-title">{{ title }}</span>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="userResumeData.name" disabled />
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="userResumeData.sex" disabled>
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄:" prop="age">
          <el-input v-model="userResumeData.age" disabled />
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="userResumeData.email" disabled />
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="userResumeData.phone" disabled />
        </el-form-item>
        <el-form-item label="地址:" prop="address">
          <el-input v-model="userResumeData.address" disabled type="textarea" />
        </el-form-item>
        <el-form-item label="学校:" prop="school">
          <el-input v-model="userResumeData.school" disabled />
        </el-form-item>
        <el-form-item label="专业:" prop="profession">
          <el-input v-model="userResumeData.profession" disabled />
        </el-form-item>
        <el-form-item label="岗位意向:" prop="career">
          <el-input v-model="userResumeData.career" disabled />
        </el-form-item>
        <el-form-item label="意向类型:" prop="type">
          <el-input v-model="userResumeData.type" disabled />
        </el-form-item>
        <el-form-item label="个人技能:" prop="skill" >
          <el-input v-model="userResumeData.skill" disabled type="textarea" />
        </el-form-item>
        <el-form-item label="个人经历:" prop="experience" >
          <el-input v-model="userResumeData.experience" disabled type="textarea" />
        </el-form-item>
      </el-form>
      <div>
        <el-button id="button-update" @click="updateUserResume"><span>修改简历</span></el-button>
      </div>
    </template>
    <update-resume-drawer />
  </div>
</template>

<style scoped>
#form-content{
  width: 50%;
  text-align: center;
  margin: 0 25%;
  padding-top: 5%;
}
#button-update {
  color: white;
  background-color: #409eff;
  border-radius: 3px;
  border: #409eff 1px solid;
  width: 40%;
  height: 3em;
  text-align: center;
  margin-left: 3%;
}
#null-msg {
  color: #F56C6C;
}
#text-update {
  font-size: 1.0em;
  color: #409eff;
}
#form-title {
  font-size: 1.5em;
}
#null-alert{
  font-size: 1.2em;
  margin-top: 5%;
  text-align: center;
}
</style>