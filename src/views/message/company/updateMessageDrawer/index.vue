<script setup>
import { ref,reactive,inject,onMounted} from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { getCompanyMessage,updateByCompanyId } from '@/apis/Company'
import { pcaTextArr } from 'element-china-area-data'
import { formatDate } from '@/utils/formatDate'

const isShowDrawer = inject('isShowDrawer')
const updateShowDrawer = inject('updateShowDrawer')
const title = inject('drawerTitle')
const updateForm = ref(null)

const drawerMessage = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  basicAddress: '',
  detailAddress: '',
  createDate: ''
})

const options = reactive({
  addressList: []
})

onMounted(() =>{
  getCompanyMessage().then(res =>{
    if (res.code === 200) {
      drawerMessage.name = res.data.companyName
      drawerMessage.email = res.data.companyEmail
      drawerMessage.phone = res.data.companyPhone
      drawerMessage.createDate= formatDate(new Date(Date.parse(res.data.companyCreateDate)), 'YY-MM-DD')
    }else {
      ElMessage({
        type: 'error',
        message: '获取公司信息失败'
      })
    }
  })
})

const rules = {
  name: [
    { required: true, message: '请输入公司名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入公司电话', trigger: 'blur' },
    { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  basicAddress: [
    { required: true, message: '请选择公司地址', trigger: 'change' }
  ],
  detailAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  createDate: [
    { required: true, message: '请选择创建日期', trigger: 'blur' }
  ]
}

function handleUpdateMessage(form) {
  ElMessageBox.confirm(
      '確定要更新公司信息吗？',
      '提示',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true
      }
  ).then(() => {
    form.validate((valid) => {
      if (valid) {
        drawerMessage.basicAddress=options.addressList.join('')
        drawerMessage.address=drawerMessage.basicAddress+drawerMessage.detailAddress
        updateByCompanyId({name: drawerMessage.name, phone: drawerMessage.phone,
                                address: drawerMessage.address, createDate: drawerMessage.createDate})
            .then( res => {
              if (res.code === 200) {
                ElMessage({
                  type:'success',
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
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消修改'
    })
  })
}

const props= {
  checkStrictly: true
}

</script>

<template>
  <el-drawer v-model="isShowDrawer" :direction="'rtl'">
    <template #title>
      <div id="title-text">
        <h2>{{title}}</h2>
      </div>
    </template>
    <template #default>
      <div>
        <el-form ref="updateForm" :model="drawerMessage" :label-position="'top'" :rules="rules">
          <el-form-item label="公司名:" prop="name">
            <el-input v-model="drawerMessage.name" placeholder="请输入公司名" />
          </el-form-item>
          <el-form-item label="公司电话:" prop="phone">
            <el-input v-model="drawerMessage.phone" placeholder="请输入公司电话" />
          </el-form-item>
          <el-form-item label="公司邮箱:" prop="email" disabled>
            <el-input v-model="drawerMessage.email" />
          </el-form-item>
          <el-form-item label="公司地址:" prop="basicAddress">
            <el-cascader class="cascade-search"
                         filterable
                         clearable
                         :props="props"
                         :options="pcaTextArr"
                         v-model="options.addressList"
            />
          </el-form-item>
          <el-form-item label="详细地址:" prop="detailAddress">
            <el-input v-model="drawerMessage.detailAddress" placeholder="请输入详细地址" type="textarea" />
          </el-form-item>
          <el-form-item label="创建日期:" prop="createDate">
            <el-date-picker
                v-model="drawerMessage.createDate"
                type="date"
                placeholder="请选择日期"
            />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div class="drawer-footer">
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
.cascade-search{
  width: 60%;
}
.drawer-footer{
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
</style>