<script setup>
import { ref,reactive,provide,onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCompanyList } from '@/apis/Company'
import companyTable from '@/views/companyList/companyTable/index.vue'

const companyDataList = reactive([])
const companyCount = ref(0)
const isLoading = ref(false)

const updateLoading = (status) => {
  isLoading.value = status
}

provide('isLoading',isLoading)
provide('updateLoading', updateLoading)

function getMessageList(params = {page:1,pageSize:5}){
  updateLoading(true)
  getCompanyList(params).then(res => {
    if(res.code === 200){
      companyCount.value=res.data.total
      companyDataList.splice(0)
      companyDataList.push(...res.data.companyList)
      updateLoading(false)
    }else {
      ElMessage({
        type: 'error',
        message: '获取公司列表失败'
      })
    }
  })
}

onMounted(() => {
  getMessageList()
})

function handleGetCompanyList(page){
  getMessageList(page)
}

</script>

<template>
  <div class="company-list">
    <company-table
      :company-list="companyDataList"
      :count="companyCount"
      :is-loading="isLoading"
      @turn-page="handleGetCompanyList"
    />
  </div>
</template>

<style scoped>

</style>