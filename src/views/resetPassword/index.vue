<script setup>
import layoutHeader from "@/components/layoutHeader"
import captcha from "@/components/captcha"
import { resetPassword }  from '@/apis/Password'
import { getEmailCode } from "@/apis/Email"
import { reactive, ref } from "vue"
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const resetPasswordForm = ref(null)
const title=ref('')
const route = useRoute()
const router = useRouter()
const textGetCodeButton=ref(null)
const noMatchCode=ref(false)
const emailErrorMsg=ref('')
const captchaCode=ref('')
title.value=route.meta.title

const resetPasswordData = reactive({
  email: '',
  emailCode: '',
  password: '',
  repassword: '',
  captcha: ''
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
      getEmailCode({ email: resetPasswordData.email }).then( res => {
        if (res.code === 200) {
          console.log('send')
        }else {
          emailErrorMsg.value='找不到该邮箱'
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

//检测邮箱格式
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
  if (value !== resetPasswordData.password) {
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

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ],
  emailCode: [
    { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: checkPassword, trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: checkRePassword, trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { validator: checkCaptcha, trigger: 'blur' }
  ]
}

function handleResetPassword(resetPasswordForm) {
  resetPasswordForm.validate(isValid => {
    if(isValid) {
      resetPassword({
            email: resetPasswordData.email,
            password: resetPasswordData.password,
            emailCode: resetPasswordData.emailCode
          })
          .then(res => {
            if (res.code === 200) {
              ElMessage({
                type: 'success',
                message: '密码修改成功，请重新登录'
              })
              router.push('/login')
            } else if (res.code === 400) {
              ElMessage({
                type: 'error',
                message: '用户不存在'
              })
              resetPasswordForm.resetFields(['email', 'emailCode', 'password', 'repassword', 'captcha'])
              noMatchCode.value = !noMatchCode.value
            } else {
              ElMessage({
                type: 'error',
                message: '验证码错误'
              })
              resetPasswordForm.resetFields(['emailCode'])
              noMatchCode.value = !noMatchCode.value
            }
          })
    }
  })
}

</script>

<template>
  <div id="content">
    <layoutHeader />
    <div id="form-content">
      <el-form ref="resetPasswordForm" :model="resetPasswordData" :rules="rules" label-width="auto" label-position="left">
        <span id="form-title">{{title}}</span>
        <el-form-item label="邮箱" :error="emailErrorMsg" prop="email">
          <el-input v-model="resetPasswordData.email"/>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="resetPasswordData.password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="resetPasswordData.repassword"/>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode">
          <el-input v-model="resetPasswordData.emailCode">
            <template #append>
              <el-button type="primary"
                         :disabled="buttonGetCode.isCodeCd"
                         @click="buttonGetEmailCode(resetPasswordForm,textGetCodeButton)">
                <span id="text-getCode-button" ref="textGetCodeButton">{{buttonGetCode.buttonText}}</span>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="图形验证码" prop="captcha">
          <el-input v-model="resetPasswordData.captcha">
            <template #append>
              <captcha :no-match-code="noMatchCode" @get-captcha="handleGetCaptcha" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div id="button-content">
        <el-button id="button-reset" @click="handleResetPassword(resetPasswordForm)">重置密码</el-button>
        <el-button id="button-reset"  @click="router.push('/login')">返回登录</el-button>
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
#button-reset {
  color: white;
  background-color: #409eff;
  border-radius: 3px;
  border: #409eff 1px solid;
  width: 200px;
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
#button-content{
  text-align: center;
}
</style>