<script setup>
import { ref,reactive,provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUserMessage } from '@/apis/User'
import updateMessageDrawer from '@/views/message/user/updateMessageDrawer/index.vue'
import { ElMessage } from 'element-plus'

const userMessageForm=ref(null)
const router=useRouter()
const route=useRoute()
const title=ref('')
const nullMsg=ref('您的信息并不完善，请完善您的信息!')
const isMsgNull=ref(true)
const isShowDrawer=ref(false)
const drawerTitle=ref('')
const avatarUrl=ref('')
title.value=route.meta.title

const userMessageData = reactive({
  name: '',
  sex: '',
  age: '',
  address: '',
  school: '',
  profession: '',
  phone: '',
})

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

function updateUserMessage() {
  updateShowDrawer(true)
  updateDrawerTitle("修改信息")
}

function prefectInfo() {
  updateShowDrawer(true)
  updateDrawerTitle("完善信息")
}

getUserMessage().then(res => {
  if(res.code === 200){
    userMessageData.name=res.data.userName
    userMessageData.sex=res.data.userSex
    userMessageData.age=res.data.userAge
    userMessageData.address=res.data.userAddress
    userMessageData.school=res.data.userSchool
    userMessageData.profession=res.data.userProfession
    userMessageData.phone=res.data.userPhone
    isMsgNull.value=false
  }else if(res.code === 406){
    ElMessage({
      type: 'info',
      message: '您还没有完善您的基本信息，请先完善信息！'
    })
  }
  else{
    console.log(res.message)
  }
})

</script>

<template>
  <div id="form-content">
      <el-form ref="userMessageForm" :model="userMessageData" label-width="auto" label-position="left">
        <span id="form-title">{{title}}</span>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="userMessageData.name" disabled />
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="userMessageData.sex" disabled>
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄:" prop="age">
          <el-input v-model="userMessageData.age" disabled />
        </el-form-item>
        <el-form-item label="地址:" prop="address">
          <el-input type="textarea" v-model="userMessageData.address" disabled />
        </el-form-item>
        <el-form-item label="学校:" prop="school">
          <el-input v-model="userMessageData.school" disabled />
        </el-form-item>
        <el-form-item label="专业:" prop="profession">
          <el-input v-model="userMessageData.profession" disabled />
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="userMessageData.phone" disabled />
        </el-form-item>
        <el-form-item>
          <template v-if="isMsgNull">
            <span id="null-msg">{{nullMsg}}</span>
            <el-button id="text-update" text @click="prefectInfo">
              <span>点击此处完善信息</span>
            </el-button>
          </template>
        </el-form-item>
      </el-form>
      <button id="button-update" @click="updateUserMessage"><span>修改信息</span></button>
      <update-message-drawer />
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
  width: 50%;
  height: 3em;
  text-align: center;
  margin-left: 3%;
}
#null-msg {
  color: #F56C6C;
}
#text-update {
  color: #409eff;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
#form-title {
  font-size: 1.5em;
}
</style>