<script setup>
import { ref, reactive,inject, defineProps, defineEmits, provide } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatDate'
import { getListByCompanyName } from '@/apis/Recruit'
import recruitTable from '@/views/recruitList/recruitTable/index.vue'

const props =defineProps({
  companyList: {
    type: Array,
    default(){
      return []
    }
  },
  count: {
    type: Number,
    default(){
      return 0
    }
  }
})

const emits = defineEmits(['turnPage','getCompanyRecruitList'])
const recruitDataList = reactive([])
const recruitCount = ref(0)
const isLoading = inject('isLoading')
const updateLoading = inject('updateLoading')
const companyName = ref('')
const table = ref(null)

function handleGetCompanyName(index){
  companyName.value=props.companyList[index].companyName
}

function handleExpand(row,index){
  table.value.toggleRowExpansion(row)
  handleGetCompanyName(index)
  getRecruitList({page: 1, pageSize: 5})
}

const recruitLoading = ref(false)
const updateRecruitLoading = (status) => {
  recruitLoading.value = status
}

provide('isLoading', recruitLoading)
provide('updateIsLoading', updateRecruitLoading)

function getRecruitList(params = {page: 1, pageSize: 5}){
  updateRecruitLoading(true)
  getListByCompanyName({companyName: companyName.value, page: params.page, pageSize: params.pageSize}).then(res => {
    if(res.code === 200){
      recruitCount.value=res.data.total
      recruitDataList.splice(0)
      recruitDataList.push(...res.data.recruitList)
      updateRecruitLoading(false)
    }else if(res.code === 406){
      ElMessage({
        type: 'info',
        message: '该公司暂无招聘信息'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '获取招聘信息失败'
      })
    }
  })
}

function handleTurnPage(page){
  getRecruitList(page)
}

</script>

<template>
  <div id="company-table" v-loading="isLoading">
    <div id="company-list">
      <el-table id="table-company" ref="table" :data="props.companyList" :default-sort="{ prop: 'companyCreateDate', order: 'descending' }" >
        <el-table-column type="expand" width="1">
          <template #default="scope">
            <recruit-table
              :recruit-list="recruitDataList"
              :count="recruitCount"
              :is-loading="recruitLoading"
              border
              @turn-page="handleTurnPage"
            />
          </template>
        </el-table-column>
        <el-table-column prop="companyId" label="公司ID" width="200" />
        <el-table-column prop="companyName" label="公司名称" width="200" />
        <el-table-column prop="companyAddress" label="公司地址" width="200" />
        <el-table-column prop="companyPhone" label="公司电话" width="200" />
        <el-table-column prop="companyEmail" label="公司邮箱" width="300" />
        <el-table-column prop="companyCreateDate" label="创建时间" width="200">
          <template #default="{ row }">
            {{formatDate(new Date(Date.parse(row.companyCreateDate)),'YY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="handleExpand(scope.row,scope.$index)">所招职位</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <span class="text-count">共{{props.count}}条公司信息</span>
      </div>
    </div>
    <div id="company-page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="props.count"
        :page-size="5"
        hide-on-single-page
        @current-change="(page) => {emits('turnPage',{page: page, pageSize: 5})} "
      />
    </div>
  </div>
</template>

<style scoped>
#company-table{
  background: #f5f5f5;
}
#company-list{
  margin-top: 20px;
  margin-bottom: 20px;
}
#company-page{
  display: flex;
  justify-content: center;
}
.text-count{
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
}
</style>