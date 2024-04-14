<script setup>
import { ref,inject, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { addDelivery } from '@/apis/Delivery'
import { formatDate } from '@/utils/formatDate'

const props = defineProps({
  recruitList: {
    type: Array,
    default() {
      return []
    }
  },count: {
    type: Number,
    default() {
      return 0
    }
  }
})

const emits = defineEmits(['turnPage'])
const router = useRouter()
const isLoading = inject('isLoading')
const updateLoading = inject('updateLoading')
const recruitId = ref('')
const companyName = ref('')
const table = ref(null)

function getRecruitId(index){
  recruitId.value=props.recruitList[index].recruitId
}

function getRecruitIdAndCompanyName(index){
  recruitId.value=props.recruitList[index].recruitId
  companyName.value=props.recruitList[index].companyName
}

function handleAddDelivery(){
  updateLoading(true)
  addDelivery({recruitId: recruitId.value, companyName: companyName.value}).then(res => {
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
}

function handleExpand(row){
  table.value.toggleRowExpansion(row)
}

</script>

<template>
  <div id="recruit-table" v-loading="isLoading">
    <div id="recruit-list">
      <el-table id="table-recruit" ref="table" :data="props.recruitList" :default-sort="{ prop: 'releaseDate' , order: 'descending' }" >
        <el-table-column type="expand" width="1">
          <template #default="scope">
            <div class="expand-text">
              <p>公司名称:{{props.recruitList[scope.$index].companyName}}</p>
              <p>公司地址:{{props.recruitList[scope.$index].companyAddress}}</p>
              <p>职位名称:{{props.recruitList[scope.$index].career}}</p>
              <p>入职要求:{{props.recruitList[scope.$index].message}}</p>
              <p>是否包吃住:{{props.recruitList[scope.$index].freefl? '是' : '否'}}</p>
              <p>薪资水平:{{props.recruitList[scope.$index].salary}}</p>
              <p>联系电话:{{props.recruitList[scope.$index].companyPhone}}</p>
              <p>公司邮箱:{{props.recruitList[scope.$index].companyEmail}}</p>
              <p>发布时间:{{formatDate(new Date(Date.parse(props.recruitList[scope.$index].releaseDate)),'YY-MM-DD')}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="recruitId" label="招聘ID" width="200" />
        <el-table-column prop="companyName" label="公司名称" width="200" />
        <el-table-column prop="career" label="职位名称" width="200" />
        <el-table-column prop="number" label="招聘人数" width="200" />
        <el-table-column prop="salary" label="薪资" width="200" />
        <el-table-column prop="releaseDate" label="发布时间" width="200" sortable>
          <template #default="{row}">
            {{formatDate(new Date(Date.parse(row.releaseDate)),'YY-MM-DD')}}
          </template>
        </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="text" @click="handleExpand(scope.row,scope.$index)">查看详情</el-button>
              <el-popconfirm
                  title="确认投递？"
                  @confirm="handleAddDelivery"
                  cancel-button-text="取消"
                  confirm-button-text="确认"
                  confirm-button-type="primary"
              >
                <template #reference>
                  <el-button type="text" @click="getRecruitIdAndCompanyName(scope.$index)">投递简历</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <div id="recruit-page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="props.count"
        :page-size="5"
        hide-on-single-page
        @current-change="(page) => {emits('turnPage',{page: page, pageSize: 5})}"
      />
    </div>
  </div>
</template>

<style scoped>
#recruit-table {
  background-color: #f5f5f5;
}
#recruit-list {
  margin-top: 20px;
  margin-bottom: 20px;
}
#recruit-page {
  display: flex;
  justify-content: center;
}
.expand-text {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
}
</style>