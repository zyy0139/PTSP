<script setup>
import { ref, reactive, inject, defineProps} from 'vue'
import { formatDate } from '@/utils/formatDate'
import { passDelivery, admitDelivery } from '@/apis/Delivery'
import { ElMessage } from 'element-plus'

const isShowDialog = inject('isShowDialog')
const updateShowDialog = inject('updateShowDialog')
const isLoading = inject('isLoading')
const updateLoading = inject('updateLoading')

const props =defineProps({
  resumeMessage:{
    type:Object,
    default:{}
  }
})
</script>

<template>
  <el-dialog v-model="isShowDialog" title="简历信息详情" width="50%" center>
    <el-form :model="props.resumeMessage" label-width="100px" v-loading="isLoading">
      <el-form-item label="姓名:">
        {{ props.resumeMessage.userName }}
      </el-form-item>
      <el-form-item label="性别:">
        {{ props.resumeMessage.userSex }}
      </el-form-item>
      <el-form-item label="年龄:">
        {{ props.resumeMessage.userAge }}
      </el-form-item>
      <el-form-item label="应聘岗位:">
        {{ props.resumeMessage.recruitName }}
      </el-form-item>
      <el-form-item label="地址:">
        {{ props.resumeMessage.userAddress }}
      </el-form-item>
      <el-form-item label="联系方式:">
        {{ props.resumeMessage.userPhone }}
      </el-form-item>
      <el-form-item label="学校:">
        {{ props.resumeMessage.userSchool }}
      </el-form-item>
      <el-form-item label="专业:">
        {{ props.resumeMessage.userProfession }}
      </el-form-item>
      <el-form-item label="个人技能:">
        {{ props.resumeMessage.skill }}
      </el-form-item>
      <el-form-item label="个人经历:">
        {{ props.resumeMessage.experience }}
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.el-form-item {
  text-align: center;
}
#btn-admit #btn-pass {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>