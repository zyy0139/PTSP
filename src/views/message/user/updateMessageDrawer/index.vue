<script setup>
import { ref,reactive,inject} from 'vue'
import { updateByUserId,getUserMessage } from '@/apis/User'
import { ElMessage,ElMessageBox } from 'element-plus'

const isShowDrawer=inject('isShowDrawer')
const updateShowDrawer=inject('updateShowDrawer')
const title=inject('drawerTitle')
const updateForm=ref(null)

const drawerMessageData=reactive({
  name: '',
  sex: '',
  age: '',
  address: '',
  school: '',
  profession: '',
  phone: ''
})

getUserMessage().then(res =>{
  if(res.code === 200){
    drawerMessageData.name=res.data.userName
    drawerMessageData.sex=res.data.userSex
    drawerMessageData.age=res.data.userAge
    drawerMessageData.address=res.data.userAddress
    drawerMessageData.school=res.data.userSchool
    drawerMessageData.profession=res.data.userProfession
    drawerMessageData.phone=res.data.userPhone
  }else {
    ElMessage({
      type: 'error',
      message: '获取用户信息失败'
    })
  }
})

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请选择年龄', trigger: 'change' }
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
    { required: true, message: '请输入专业', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      ,min:11, max:11, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

function handleUpdateMessage(form) {
  ElMessageBox.confirm(
      '确认修改信息吗？',
      '提示',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }
  ).then(() => {
    form.validate((isValid) => {
      if (isValid) {
        updateByUserId({
          name: drawerMessageData.name, sex: drawerMessageData.sex,
          age: drawerMessageData.age, address: drawerMessageData.address,
          school: drawerMessageData.school, profession: drawerMessageData.profession, phone: drawerMessageData.phone
        }).then(res => {
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '修改成功'
            })
            updateShowDrawer(false)
            window.location.reload()
          }else {
            ElMessage({
              type: 'error',
              message: '服务器错误,修改失败,请稍后再试'
            })
          }
        })
      }
    })
  }).catch(() =>{
    ElMessage({
      type: 'info',
      message: '已取消修改'
    })
  })
}


</script>

<template>
 <el-drawer v-model="isShowDrawer" :direction="'rtl'">
    <template #header>
      <div id="title-text">
        <h2>{{title}}</h2>
      </div>
    </template>
   <template #default>
     <div>
      <el-form ref="updateForm" :model="drawerMessageData" :label-position="'top'" :rules="rules">
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="drawerMessageData.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="drawerMessageData.sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄:" prop="age">
          <el-select v-model="drawerMessageData.age" placeholder="请选择年龄">
            <el-option
              v-for="age in 100"
              :key="age"
              :label="age"
              :value="String(age)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址:" prop="address">
          <el-input type="textarea" v-model="drawerMessageData.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="学校:" prop="school">
          <el-input v-model="drawerMessageData.school" placeholder="请输入学校"></el-input>
        </el-form-item>
        <el-form-item label="专业:" prop="profession">
          <el-input v-model="drawerMessageData.profession" placeholder="请输入职业"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="drawerMessageData.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
     </div>
   </template>
   <template #footer>
     <div style="flex: auto">
       <el-button type="primary" @click="handleUpdateMessage(updateForm)">确认</el-button>
       <el-button @click="updateShowDrawer(false)">取消</el-button>
     </div>
   </template>
 </el-drawer>
</template>

<style scoped>
#title-text{
  color: black;
}
</style>