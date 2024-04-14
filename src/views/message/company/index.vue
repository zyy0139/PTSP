<script setup>
import { ref,reactive,provide,onMounted} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCompanyMessage } from '@/apis/Company'
import updateMessageDrawer from '@/views/message/company/updateMessageDrawer/index.vue'
import { formatDate } from '@/utils/formatDate'

const companyMessageForm = ref(null)
const router = useRouter()
const route = useRoute()
const title = ref('')
const nullMsg=ref('请先完善贵公司的基本信息！')
const isMsgNull=ref(true)
const isShowDrawer=ref(false)
const drawerTitle=ref('')
const avatarUrl=ref('')
title.value=route.meta.title

const companyMessage = reactive({
  name: '',
  address: '',
  email: '',
  phone: '',
  createDate: ''
})

const updateShowDrawer = (item) => {
  isShowDrawer.value = item
}

provide('isShowDrawer',isShowDrawer)
provide('updateShowDrawer',updateShowDrawer)

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

onMounted(() => {
  getCompanyMessage().then(res => {
    if (res.code === 200) {
      companyMessage.name=res.data.companyName
      companyMessage.address=res.data.companyAddress
      companyMessage.email=res.data.companyEmail
      companyMessage.phone=res.data.companyPhone
      companyMessage.createDate=formatDate(new Date(Date.parse(res.data.companyCreateDate)),'YY-MM-DD')
      isMsgNull.value=false
    }else if(res.code === 406){
      ElMessage({
        type: 'info',
        message: '请先完善贵公司的基本信息！'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '获取公司信息失败！'
      })
    }
  })
})

</script>

<template>
  <div id="form-content">
    <el-form ref="companyMessageForm" :model="companyMessage" label-width="auto" label-position="left">
      <span id="form-title">{{title}}</span>
      <el-form-item label="公司名:" prop="name">
        <el-input v-model="companyMessage.name" disabled />
      </el-form-item>
      <el-form-item label="公司邮箱:" prop="email">
        <el-input v-model="companyMessage.email" disabled />
      </el-form-item>
      <el-form-item label="公司电话:" prop="phone">
        <el-input v-model="companyMessage.phone" disabled />
      </el-form-item>
      <el-form-item label="公司地址:" prop="address">
        <el-input v-model="companyMessage.address" disabled />
      </el-form-item>
      <el-form-item label="创建时间:" prop="createDate">
        <el-input v-model="companyMessage.createDate" disabled />
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
    <el-button id="button-update" type="primary" @click="updateUserMessage"><span>修改信息</span></el-button>
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