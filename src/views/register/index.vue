<script setup>
import {reactive, ref} from 'vue'
import { userRegister } from '@/apis/User.js'
import { companyRegister } from  '@/apis/Company.js'
import { getEmailCode } from '@/apis/Email.js'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import Captcha from "@/components/captcha.vue";
import PassportHeader from '@/components/layoutHeader.vue'

const registerFrom=ref(null)
const title=ref('')
const route = useRoute()
const router = useRouter()
const textGetCodeButton=ref(null)
const noMatchCode=ref(false)
const emailErrorMsg=ref('')
const captchaCode=ref('')
title.value=route.meta.title

const registerData=reactive({
  account:'',
  email:'',
  password:'',
  repassword:'',
  type:'',
  emailCode:'',
  captcha:''
})

const buttonGetCode =reactive({
  isCodeCd: false,
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
      clearInterval(countCd)
      buttonGetCode.isCodeCd=false
      textGetCodeButton.classList.toggle('text-getCode-button')
      buttonGetCode.buttonText='重新获取验证码'
    }
  },900)
  registerFrom.validateField(['email'], isValid => {
    if (isValid) {
      //  验证通过
      ElMessage({
        type: 'success',
        message: '验证码已发送'
      })
      getEmailCode({ email: registerData.email }).then( res => {
        if (res.code === 200) {
          console.log('send')
        }else {
          emailErrorMsg.value='该邮箱已注册'
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
function checkAccount(rule,value,callback){
  if (value.length>=8 && value.length<=12){
    return callback()
  }
  return callback(new Error('账号需由8到12位数字组成'))
}

//检测邮箱合法性
function checkEmail(rule,value,callback){
  if (!(/^[^@]+@[^@]+$/.test(value))) {
    return callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}

//检测密码合法性
function checkPassword(rule,value,callback){
  if (value.length >= 6 && value.length <= 18) {
    return callback()
  }
  return callback(new Error('密码需位6-18位包含字母或数字的字符串'))
}

//验证重复密码
function checkRePassword(rule, value, callback) {
  if (value !== registerData.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

//负责处理获取图形验证码事件
function handleGetCaptcha(code) {
  captchaCode.value = code
}

//验证图形验证码合法性
function checkCaptcha(rule, value, callback) {
  if (value === captchaCode.value) {
    return callback()
  } else {
    noMatchCode.value = !noMatchCode.value
    return callback(new Error('请输入正确的验证码'))
  }
}

//规范输入格式
const rule=reactive({
  account:[
    {required: true,message: '账号不能为空',trigger: 'blur'},
    {validator:checkAccount,trigger: 'blur'}
  ],
  email:[
    {required: true,message: '邮箱不能为空',trigger: 'blur'},
    {validator:checkEmail,trigger: 'blur'}
  ],
  password:[
    {required: true,message: '密码不能为空',trigger: 'blur'},
    {validator:checkPassword,trigger: 'blur'}
  ],
  repassword:[
    {required: true,message: '两次密码输入不一致',trigger: 'blur'},
    {validator: checkRePassword,trigger: 'blur'}
  ],
  type:[
    {required: true,message: '请选择注册类型',trigger: 'blur'}
  ],
  emailCode:[
    {required: true,message: '验证码不能为空',trigger: 'blur'},
    {min: 4,max: 4,message: '验证码格式错误',trigger: 'blur'}
  ],
  captcha:[
    {required: true, message: '验证码不能为空', trigger: 'blur'},
    {validator: checkCaptcha, trigger: 'blur'}
  ]
})

//处理注册
function handleRegister(registerForm){
  registerForm.validate(isvalid =>{
    if(isvalid){
      if(registerData.type==="student"){
        userRegister({account:registerData.account,email:registerData.email,password:registerData.password,
          emailCode:registerData.emailCode}).then(res =>{
          if(res.code === 200){ //注册成功
            ElMessage({
              type:'success',
              message:'注册成功'
            })
            router.push('/login')
          }else if(res.code === 400) { //邮箱存在
            ElMessage({
              type: 'error',
              message: '该邮箱已注册'
            })
            //重置界面
            registerForm.resetFields(['account', 'email', 'password', 'rePassword', 'emailCode', 'captcha'])
            noMatchCode.value = !noMatchCode.value
          }else if(res.code===500){ //验证码错误
            ElMessage({
              type:'error',
              message:'验证码错误'
            })
            //重置验证码
            registerForm.resetFields(['emailCode'])
            noMatchCode.value=!noMatchCode.value
          }
        })
      }else {
        companyRegister({account:registerData.account,email:registerData.email,password:registerData.password,
          emailCode:registerData.emailCode}).then(res =>{
          if(res.code===200){ //注册成功
            ElMessage({
              type:'success',
              message:'注册成功'
            })
            router.push('/login')
          }else if(res.code===400) { //邮箱存在
            ElMessage({
              type: 'error',
              message: '该邮箱已注册'
            })
            //重置界面
            registerForm.resetFields(['account', 'email', 'password', 'rePassword', 'emailCode', 'captcha'])
            noMatchCode.value = !noMatchCode.value
          }else if(res.code===500){ //验证码错误
            ElMessage({
              type:'error',
              message:'验证码错误'
            })
            //重置验证码
            registerForm.resetFields(['emailCode'])
            noMatchCode.value=!noMatchCode.value
          }
        })
      }
    }
  })
}
</script>

<template>
  <div id="content">
    <passport-header/>
    <div id="body">
      <div id="body-header">
        <router-link to ='login'>已有帐号？去登陆</router-link>
      </div>
      <div id="form-content">
        <el-form ref="registerFrom" :model="registerData" :rules="rule" label-width="auto">
          <span id="form-title">{{title}}</span>
          <el-form-item label="账号:" prop="account" >
            <el-input v-model="registerData.account"/>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="registerData.email"/>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input v-model="registerData.password" type="password"/>
          </el-form-item>
          <el-form-item label="重复密码:" prop="repassword">
            <el-input v-model="registerData.repassword" type="password"/>
          </el-form-item>
          <el-form-item label="注册类型:" prop="type">
            <el-radio-group v-model="registerData.type">
              <el-radio value="student">学生用户</el-radio>
              <el-radio value="company">公司用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱验证码:" prop="emailCode">
              <el-input v-model="registerData.emailCode">
                <template #append>
                  <el-button type="primary"
                             :disabled="buttonGetCode.isCodeCd"
                             @click="buttonGetEmailCode(registerFrom,textGetCodeButton)">
                    <span id="text-getCode-button" ref="textGetCodeButton">{{buttonGetCode.buttonText}}</span>
                  </el-button>
                </template>
              </el-input>
          </el-form-item>
          <el-form-item label="图形验证码:" prop="captcha">
            <el-input v-model="registerData.captcha">
              <template #append>
                <captcha :no-match-code="noMatchCode" @get-captcha="handleGetCaptcha"/>
              </template>
            </el-input>
          </el-form-item>
          <button id="button-register" @click.prevent="handleRegister(registerFrom)">立即注册</button>
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