<script setup>
import Captcha from '@/components/captcha.vue'
import {userAccountLogin,userEmailLogin} from '@/apis/User.js'
import {companyAccountLogin,companyEmailLogin} from '@/apis/Company.js'
import {getEmailCode} from '@/apis/Email.js'
import router from '@/router/index.js'
import {ref,reactive,onMounted} from 'vue'
import { asyncAddRouter } from '@/router'
import LayoutHeader from '@/components/layoutHeader.vue'
import { ElMessage } from 'element-plus'
import { userStores } from '@/store/user.js'

const accountLoginForm=ref(null)
const emailLoginForm=ref(null)
const textGetCodeButton=ref(null)
const isLogin=ref(false)
const noMatchCode=reactive({
  apLoginNoMatchCaptchaCode: false,
  elLoginNoMatchCaptchaCode: false
})
const accountLoginData=reactive({
  account:'',
  password:'',
  type:'',
  captcha:''
})
const emailLoginData=reactive({
  email:'',
  type:'',
  emailCode:'',
  captcha:''
})
const buttonGetCode=reactive({
  isCodeCD:false,
  buttonText:'获取验证码'
})
const tableName=ref('accountLoginForm')
const emitCaptcha=reactive({
  apCaptcha:'',
  elCaptcha:''
})
const accountRules=reactive({
  account:[
    {required: true,message: '账号不能为空',trigger: 'blur'}
  ],
  password:[
    {required: true,message: '密码不能为空',trigger: 'blur'}
  ],
  type:[
    {required: true,message: '请选择登录类型',trigger: 'blur'}
  ],
  captcha:[
    {validator: checkCaptcha,trigger: 'blur'}
  ]
})
const emailRules=reactive({
  email:[
    {required: true,message: '邮箱不能为空',trigger: 'blur'},
    {validator: checkEmail,trigger: 'blur'}
  ],
  type:[
    {required: true,message: '请选择登录类型',trigger: 'blur'}
  ],
  captcha:[
    {validator: checkCaptcha,trigger: 'blur'}
  ],
  emailCode:[
    {required: true,message: '验证码不能为空',trigger: 'blur'},
    {min: 4,max: 4,message: '请输入正确的验证码',trigger: 'blur'}
  ]
})

const userStore=userStores()

onMounted(()=>{
  userStore.resetUserToken()
})

function handleTableChange(){
  accountLoginData.captcha=''
}

function checkCaptcha(rule,value,callback){
  if(value===''){
    return callback(new Error('请输入验证码'))
  }else {
    if(tableName.value==='accountLoginForm'){
      if(value!==emitCaptcha.apCaptcha){
        noMatchCode.apLoginNoMatchCaptchaCode=!noMatchCode.apLoginNoMatchCaptchaCode
        return callback(new Error('验证码错误'))
      }
    }else {
      if(value!==emitCaptcha.elCaptcha){
        noMatchCode.elLoginNoMatchCaptchaCode=!noMatchCode.apLoginNoMatchCaptchaCode
        return callback(new Error('验证码错误'))
      }
    }
  }
}
function checkEmail(rule,value,callback){
  if (!(/^[^@]+@[^@]+$/.test(value))) {
    return callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
function buttonGetEmailCode(emaiLoginForm,textGetCodeButton){
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
  emaiLoginForm.validateField(['email'], isValid => {
    if (isValid) {
      //  验证通过
      ElMessage({
        type: 'success',
        message: '验证码已发送'
      })
      getEmailCode({ email: emailLoginData.email }).then( res => {
        if (res.code === 200) {
          console.log('send')
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

function accountHandleGetCaptcha(captcha){
  emitCaptcha.apCaptcha=captcha
}

function emailHandleGetCaptcha(captcha){
  emitCaptcha.elCaptcha=captcha
}

function userLoginSuccess(res){
  isLogin.value=false
  asyncAddRouter()
  router.push('user')
}

function companyLoginSuccess(res){
  isLogin.value=false
  asyncAddRouter()
  router.push('')
}

function accountLogin(accountLoginForm){
  if(accountLoginData.type === 'student'){
    //学生用户账密登陆操作
    userAccountLogin({account:accountLoginData.account,password:accountLoginData.password}).then(res=>{
      if(res.code===200){
        //登录成功，跳转页面
        ElMessage({
          message:'登录成功',
          type:'success'
        })
        userLoginSuccess(res)
      }else {
        //输入错误，清空表单，重置验证码
        isLogin.value=false
        accountLoginForm.resetFields()
        noMatchCode.apLoginNoMatchCaptchaCode=!noMatchCode.apLoginNoMatchCaptchaCode
        ElMessage({
          message:'账号或密码错误',
          type:'error'
        })
      }
      isLogin.value=false
    },rej=>{
      //网络问题
      console.log(rej)
      ElMessage({
        message:'网络错误，请稍后重试',
        type:'error'
      })
      noMatchCode.apLoginNoMatchCaptchaCode=!noMatchCode.apLoginNoMatchCaptchaCode
      isLogin.value=false
    })
  }else {
    //公司用户账密登录操作
    companyAccountLogin({account:accountLoginData.account,password:accountLoginData.password}).then(res=>{
      if(res.code===200){
        //登录成功，跳转页面
        ElMessage({
          message:'登录成功',
          type:'success'
        })
        companyLoginSuccess(res)
      }else {
        //输入错误，清空表单，重置验证码
        isLogin.value=false
        accountLoginForm.resetFields()
        noMatchCode.apLoginNoMatchCaptchaCode=!noMatchCode.apLoginNoMatchCaptchaCode
        ElMessage({
          message:'账号或密码错误',
          type:'error'
        })
      }
      isLogin.value=false
    },rej=>{
      //网络问题
      console.log(rej)
      ElMessage({
        message:'网络错误，请稍后重试',
        type:'error'
      })
      noMatchCode.apLoginNoMatchCaptchaCode=!noMatchCode.apLoginNoMatchCaptchaCode
      isLogin.value=false
    })
  }
}

function emailLogin(emailLoginForm){
  if(emailLoginData.type === 'student'){
    userEmailLogin({email:emailLoginData.email,emailCode:emailLoginData.emailCode}).then(res=>{
      if(res.code===200){
        //登录成功，跳转页面
        ElMessage({
          message:'登录成功',
          type:'success'
        })
        userLoginSuccess(res)
      }else {
        //输入错误，清空表单，重置验证码
        isLogin.value=false
        emailLoginForm.resetFields()
        noMatchCode.elLoginNoMatchCaptchaCode=!noMatchCode.elLoginNoMatchCaptchaCode
        ElMessage({
          message:'邮箱或验证码错误',
          type:'error'
        })
      }
      isLogin.value=false
    },rej=>{
      //网络问题处理
      console.log(rej)
      ElMessage({
        message:'网络错误，请稍后再试',
        type:'error'
      })
      noMatchCode.elLoginNoMatchCaptchaCode=!noMatchCode.elLoginNoMatchCaptchaCode
      isLogin.value=false
    })
  }else {
    companyEmailLogin({email:emailLoginData.email,emailCode:emailLoginData.emailCode}).then(res=>{
      if (res.code===200){
        //登录成功，跳转页面
        ElMessage({
          message:'登录成功',
          type:'success'
        })
        companyLoginSuccess(res)
      }else {
        //输入错误，清空表单，重置验证码
        isLogin.value=false
        emailLoginForm.resetFields()
        noMatchCode.elLoginNoMatchCaptchaCode=!noMatchCode.elLoginNoMatchCaptchaCode
        ElMessage({
          message:'邮箱或验证码错误',
          type:'error'
        })
      }
      isLogin.value=false
    },rej=>{
      //网络问题处理
      console.log(rej)
      ElMessage({
        message:'网络错误，请稍后再试',
        type:'error'
      })
      noMatchCode.elLoginNoMatchCaptchaCode=!noMatchCode.elLoginNoMatchCaptchaCode
      isLogin.value=false
    })
  }
}

function buttonLogin(tableName){
  isLogin.value=true
  if(tableName==='accountLoginForm'){
    accountLogin(accountLoginForm.value)
  }else {
    emailLogin(emailLoginForm.value)
  }
}

</script>

<template>
  <div id="content" v-loading:body="isLogin">
    <layout-header />
    <div id="main-box">
      <div id="box-left" />
      <div id="box-right">
        <div id="tabs-login">
          <el-tabs  v-model="tableName" type="border-card" :stretch="true" @tab-change="handleTableChange">
            <el-tab-pane label="账密登录" name="accountLoginForm">
              <el-form ref="accountLoginForm" :model="accountLoginData" :rules="accountRules">
                <el-form-item label="账号:" prop="account">
                  <el-input v-model="accountLoginData.account" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                  <el-input v-model="accountLoginData.password" placeholder="请输入密码" show-password />
                </el-form-item>
                <el-form-item label="登录类型:" prop="type">
                  <el-radio-group v-model="accountLoginData.type" property="请选择登录类型">
                    <el-radio value="student">学生用户</el-radio>
                    <el-radio value="company">公司用户</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="图形验证码:" prop="captcha">
                  <el-input v-model="accountLoginData.captcha" placeholder="请输入图形验证码" type="text">
                    <template #append>
                      <div class="img-code">
                        <captcha :no-match-code="noMatchCode.apLoginNoMatchCaptchaCode" @get-captcha="accountHandleGetCaptcha" />
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="邮箱验证码登录" name="emailLoginForm">
              <el-form ref="emailLoginForm" :model="emailLoginData" :rules="emailRules">
                <el-form-item label="邮箱:" prop="email">
                  <el-input v-model="emailLoginData.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="登录类型:" prop="type">
                  <el-radio-group v-model="emailLoginData.type" property="请选择登录类型">
                    <el-radio value="student">学生用户</el-radio>
                    <el-radio value="company">公司用户</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱验证码:" prop="emailCode">
                  <el-input v-model="emailLoginData.emailCode" type="text" placeholder="请输入邮箱验证码">
                    <template #append>
                      <el-button type="primary"
                                 :disabled="buttonGetCode.isCodeCD"
                                 @click="buttonGetEmailCode(emailLoginForm,textGetCodeButton)">
                        <span id="text-getCode-button" ref="textGetCodeButton">{{buttonGetCode.buttonText}}</span>
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="图形验证码:" prop="captcha">
                  <el-input v-model="emailLoginData.captcha" placeholder="请输入图形验证码" type="text">
                    <template #append>
                      <div class="img-code">
                        <captcha :no-match-code="noMatchCode.elLoginNoMatchCaptchaCode" @get-captcha="emailHandleGetCaptcha" />
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <button id="button-login" @click="buttonLogin(tableName)"><span>登录</span></button>
          <div id="router-link-register">
            <router-link to="/register">
              <span id="text-register">注册</span>
            </router-link>
            <router-link to="/resetPassword">
              <span id="text-register">忘记密码/修改密码</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#content {
  height: 100vh;
  background-image: url("../../assets/background.png");
}
#main-box {
  display: grid;
  grid-template-columns: 1fr 4fr 4fr 1fr;
  justify-items: center;
  margin-top: 9em;
}
#box-right>div {
  box-shadow: 0 0 18px 3px #7e7e7e;
  height: 19em;
  background-color: #ffffff;
}
#tabs-login>div {
  border-bottom: none;
}
#box-left {
  grid-column: 2  / 3;
  grid-row: 1 / 2
}
#box-right {
  grid-column: 3  / 4;
  grid-row: 1 / 2;
  width: auto;
}
.img-code {
  height: 30px;
}
#text-getCode-button {
  width: 6.2em;
  color: #8cbeff;
}
#text-getCode-button{
  color: #c4c4c4;
}
#button-login {
  color: white;
  background-color: #409eff;
  border-radius: 3px;
  border: #409eff 1px solid;
  width: 94%;
  height: 2em;
  text-align: center;
  margin-left: 3%;
}
#router-link-register {
  display: grid;
  grid-template-columns: 3% 47% 47% 3%;
  margin-left: 5%;
  font-size: 0.8rem;
}
#router-link-register a:first-child {
  grid-area: 1/2/2/3;
  justify-self: left;
}
#router-link-register a:last-child {
  grid-area: 1/3/2/4;
  justify-self: right;
}
#router-link-register > a {
  color: rgb(12,128,254);
  text-decoration-line: none;
}
#router-link-register>a:hover {
  color: #57a2ff;
}
#icon-logo {
  background-color: #57a2ff;
}
</style>