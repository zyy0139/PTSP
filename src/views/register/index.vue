<script setup>
import { reactive, ref } from 'vue'
import { getEmailCode, register } from '@/apis/user'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const registerFrom=ref(null)
const title=ref('')
const route = useRoute()
const router = useRouter()
const textGetCodeButton=ref(null)
title.value=route.meta.title

const registerData=reactive({
  account:'',
  email:'',
  password:'',
  repassword:'',
  emailCode:'',
  captcha:''
})

const buttonGetCode =reactive({
  isCodeCd:false,
  buttonText:'获取验证码'
})

//处理获取邮箱验证
function buttonGetEmailCode(registerFrom,textGetCodeButton){
  buttonGetCode.isCodeCd=true
  let codeCd=60
  textGetCodeButton.classList.toggle('text-getCode-button')
  const countCd=setInterval(() =>{
    buttonGetCode.buttonText=`重新获取(${codeCd})`
    codeCd -=1
    if (codeCd<0){
      clearInterval(codeCd)
      buttonGetCode.isCodeCd=false
      textGetCodeButton.classList.toggle('text-getCode-button')
      buttonGetCode.buttonText='重新获取验证码'
    }
  },900)
  registerFrom.validateField(['userEmail', 'captcha'], isValid => {
    if (isValid) {
      //  验证通过
      ElMessage({
        type: 'success',
        message: '验证码已发送'
      })
      getEmailCode({ userEmail: registerData.userEmail, type: codeType.value }).then(res => {
        if (res.code === 200) {
          console.log('send')
        } else if (res.code === 300) {
          //  邮箱已经注册
          emailErrorMsg.value = '该邮箱已经注册账号'
        } else if (res.code === 303) {
          emailErrorMsg.value = '该邮箱未注册账号'
        }
      }, rej => {
        console.log(rej)
        ElMessage({
          message: '网络错误，请稍后再试',
          type: 'error'
        })
      })
    }
  })
}

//检测账号合法性

const rule=reactive({
  account:[
    {required:true,message:'账号不能为空',trigger:'blur'},
  ]
})
</script>

<template>
  <div id="content">
<!--      <passport-header/>-->
    <div id="body">
      <div id="body-header">
        <router-link to ='login'>已有帐号？去登陆</router-link>
      </div>
      <div id="form-content">
        <el-form ref="registerFrom":model="registerData":rules="rule" label-width="auto" label-position="left">
          <span id="form-title">{{title}}}</span>
          <el-form-item label="账号" prop="account">
            <el-input v-model:="registerData.account"/>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerData.email"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerData.password" type="password"/>
          </el-form-item>
          <el-form-item label="重复密码" prop="repassword">
            <el-input v-model="registerData.repassword" type="password"/>
          </el-form-item>
          <el-form-item label="邮箱验证码" prop="emailCode">
            <template #append>
              <el-input v-model="registerData.repassword">
                <el-button type="primary":disabled="buttonGetCode.isCodeCd" @click="buttonGetEmailCode(registerFrom,textGetCodeButton)">
                  <span id="text-getCode-button" ref="">{{buttonGetCode.buttonText}}</span>
                </el-button>
              </el-input>
            </template>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
#content {
  height: 100vh;
}
#body {
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 0 18px 3px #7e7e7e;
  margin: 3em 20vw;
}
#body-header {
  margin-left: 2%;
  padding-top: 2%;
}
#body-header>a {
  color: #8cc3fe;
}
#form-content>form {
  text-align: center;
  margin: 0 25%;
  padding-top: 5%;
}
#form-title {
  font-size: 1.5em;
}
#form-title~div {
  margin-top: 1.2em;
}
#button-register {
  color: white;
  background-color: #409eff;
  border-radius: 3px;
  border: #409eff 1px solid;
  width: 100%;
  height: 3em;
  text-align: center;
  margin-left: 3%;
  margin-top: 2em;
  margin-bottom: 4em;
}
#text-getCode-button {
  width: 6.2em;
  color: #8cbeff;
}
#text-getCode-button.text-getCode-button {
  color: #c4c4c4;
}
</style>