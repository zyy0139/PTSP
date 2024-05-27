<script setup>
import { ref, reactive, inject, defineProps} from 'vue'
import { formatDate } from '@/utils/formatDate'
import { addDelivery } from '@/apis/Delivery'
import { ElMessage } from 'element-plus'

const recruitId = inject('recruitId')
const isShowDialog = inject('isShowDialog')
const updateShowDialog = inject('updateShowDialog')
const isLoading = inject('isLoading')
const updateLoading = inject('updateLoading')

const props = defineProps({
  recruitMessage: {
    type: Object,
    default: {}
  }
})

function handleAddDelivery(){
  updateLoading(true)
  addDelivery({recruitId: recruitId.value , companyName: props.recruitMessage.companyName }).then(res => {
    if(res.code === 200){
      ElMessage({
        type:'success',
        message: '投递成功'
      })
    }else if(res.code === 421){
      ElMessage({
        type: 'warning',
        message: '该岗位已无空余名额'
      })
    }else if (res.code === 401){
      ElMessage({
        type: 'warning',
        message: '您已经投递过该岗位'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '投递失败'
      })
    }
  })
  updateLoading(false)
  updateShowDialog(false)
}


</script>

<template>
  <el-dialog v-model="isShowDialog" title="招聘信息详情" width="50%" center>
    <el-form :model="props.recruitMessage" label-width="100px" v-loading="isLoading">
      <el-form-item label="职位名称:">
        {{ props.recruitMessage.career }}
      </el-form-item>
      <el-form-item label="公司名称:">
        {{ props.recruitMessage.companyName }}
      </el-form-item>
      <el-form-item label="公司地址:">
        {{ props.recruitMessage.companyAddress }}
      </el-form-item>
      <el-form-item label="招聘人数:">
        {{ props.recruitMessage.number }}
      </el-form-item>
      <el-form-item label="薪资:">
        {{ props.recruitMessage.salary }}
      </el-form-item>
      <el-form-item label="职位要求:">
        {{ props.recruitMessage.message }}
      </el-form-item>
      <el-form-item label="联系电话:">
        {{ props.recruitMessage.companyPhone }}
      </el-form-item>
      <el-form-item label="联系邮箱:">
        {{ props.recruitMessage.companyEmail }}
      </el-form-item>
      <el-form-item label="包吃住:">
        {{ props.recruitMessage.freefl ? '是' : '否' }}
      </el-form-item>
      <el-form-item label="发布时间:">
        {{ formatDate(new Date(props.recruitMessage.releaseDate), 'YY-MM-DD') }}
      </el-form-item>
      <el-form-item>
        <el-button id="add-delivery-btn" type="primary" @click="handleAddDelivery">投递简历</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.el-form-item {
  text-align: center;
}
#add-delivery-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>