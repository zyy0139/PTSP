<script setup>
import { HomeFilled, UserFilled, Management,
         List, Grid, Promotion, ArrowRight,
         Fold, Expand } from "@element-plus/icons-vue";
import { getName } from '@/apis/User'
import { userStores } from '@/store/user'
import { resetRouter } from '@/router'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'

const userStore=userStores()
const router=useRouter()
const isCollapse=ref(false)
const currentDate = ref('')

getName().then(res=>{
  if(res.code===200){
    if(res.data.userName ===''){
      userStore.name=res.data.account
    }else {
      userStore.name=res.data.userName
    }
  }
},()=>{
  ElMessage({
    type:'error',
    message:'error'
  })
})

function updateDate(){
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  currentDate.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  setInterval(updateDate, 1000)
})

function handleLogOut(command) {
  if (command === 'goOut') {
    userStore.$reset()
    userStore.resetUserToken()
    resetRouter()
    router.push('/')
    ElMessage({
      type: 'success',
      message: '退出成功'
    })
  }else if (command === 'changePassword'){
    router.push('changePassword')
  }else {
    router.push('message')
  }
}

function handleCollapse(){
  isCollapse.value=!isCollapse.value
}

</script>

<template>
  <el-container>
    <el-aside id="aside" :width="isCollapse ? '64px' : '200px'">
      <div id="logo">
        <img src="../assets/favicon.png" height="40" width="40" alt="这是一个logo">
          <span id="logo-text" v-show="!isCollapse">大学生兼职管理平台</span>
      </div>
      <el-menu router id="menu" style="border: none" default-active="/" :collapse="isCollapse">
        <el-menu-item index="home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>
            <span>系统首页</span>
          </template>
        </el-menu-item>
        <el-menu-item index="message">
          <el-icon><Management /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="resume" >
          <el-icon><List /></el-icon>
          <span>简历信息</span>
        </el-menu-item>
        <el-menu-item index="companyList">
          <el-icon><Grid /></el-icon>
          <template #title>
            <span>公司信息</span>
          </template>
        </el-menu-item>
        <el-menu-item index="recruitList">
          <el-icon><Promotion /></el-icon>
          <template #title>
            <span>招聘信息</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header id="header">
        <el-icon id="collapse-icon" @click="handleCollapse">
          <template v-if="!isCollapse">
            <el-icon><Fold /></el-icon>
          </template>
          <template v-else>
            <el-icon><Expand /></el-icon>
          </template>
        </el-icon>
        <div id="time-info">
          {{currentDate}}
        </div>
        <div id="user-info">
          <span>欢迎回来，{{userStore.name}}</span>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown placment="bottom" trigger="click" @command="handleLogOut">
            <el-avatar :src="userStore.avatarUrl"></el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="userMessage">个人中心</el-dropdown-item>
                <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                <el-dropdown-item command="goOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
#aside{
  background-color: #94BFF3;
  min-height: 100vh;
}
#logo{
  height: 70px;
  background-color: #2e6da4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
#menu{
  background-color: #94BFF3;
  text-color: rgba(255,255,255,0.65);
}
#logo-text{
  margin-left: 5px;
  font-size: 15px;
  transistion: all 0.3s ease;
}
#header{
  height: 70px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#collapse-icon{
  font-size: 26px;
  cursor: pointer;
}

#user-info{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

#time-info{
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: black;
}
</style>