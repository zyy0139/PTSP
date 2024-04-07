<script setup>
import captcha from '@/components/captcha.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive } from 'vue'
import { resetPassword } from '@/apis/User'
import { ElMessage,ElMessageBox } from 'element-plus'

const resetPasswordForm = reactive(null)
const title=ref('')
const route = useRoute()
const router = useRouter()
const captchaCode=ref('')
const noMatchCode=ref(false)
title.value=route.meta.title

const resetPasswordData = reactive({
  oldPassword: '',
  newPassword: '',
  repassword: '',
  captcha: ''
})

//检测密码合法性
function checkPassword(rule,value,callback){
  if (value.length >= 6 && value.length <= 18) {
    return callback()
  }
  return callback(new Error('密码需位6-18位包含字母或数字的字符串'))
}

//验证重复密码
function checkRePassword(rule, value, callback) {
  if (value !== resetPasswordData.newPassword) {
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
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { validator: checkPassword, trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: checkPassword, trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: checkRePassword, trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { validator: checkCaptcha, trigger: 'blur' }
  ]
}

function handleResetPassword(resetPasswordForm) {
  ElMessageBox.confirm(
      '确认修改密码吗？',
      '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }
  ).then(() => {
    resetPasswordForm.validate(isValid => {
      if (isValid) {
        resetPassword({
          oldPassword: resetPasswordData.oldPassword,
          newPassword: resetPasswordData.newPassword
        })
            .then(res => {
              if (res.code === 200) {
                ElMessage({
                  type: 'success',
                  message: '密码修改成功，请重新登录'
                })
                router.push('/login')
              } else {
                ElMessage({
                  type: 'error',
                  message: '旧密码输入错误'
                })
              }
            })
      }
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消修改'
    })
  })
}

</script>

<template>
  <div id="form-content">
    <el-form ref="resetPasswordForm" :model="resetPasswordData" :rules="rules" label-width="auto" label-position="left">
      <span id="form-title">{{title}}</span>
      <el-form-item label="原密码:" prop="oldPassword">
        <el-input v-model="resetPasswordData.oldPassword" />
      </el-form-item>
      <el-form-item label="新密码:" prop="newPassword">
        <el-input v-model="resetPasswordData.newPassword" />
      </el-form-item>
      <el-form-item label="确认密码:" prop="repassword">
        <el-input v-model="resetPasswordData.repassword" />
      </el-form-item>
      <el-form-item label="图形验证码:" prop="captcha">
        <el-input v-model="resetPasswordData.captcha">
          <template #append>
            <captcha :no-match-code="noMatchCode" @get-captcha="handleGetCaptcha" />
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
  <div style="text-align: center">
    <el-button id="button-reset" @click="handleResetPassword(resetPasswordForm)">重置密码</el-button>
  </div>
</template>

<style scoped>
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
</style>