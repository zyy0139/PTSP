<script setup>
import { ref,inject, defineProps, defineEmits, provide } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { deleteRecruit } from '@/apis/Recruit'
import { formatDate } from '@/utils/formatDate'
import addOrUpRecruitDrawer from '@/views/recruitManage/components/addOrUpRecruitDrawer.vue'

const props = defineProps({
  recruitList: {
    type: Array,
    default() {
      return []
    }
  },
  count: {
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
const table = ref(null)
const isShowDrawer = inject('isShowDrawer')
const updateShowDrawer = inject('updateShowDrawer')
const updateDrawerTitle = inject('updateDrawerTitle')
const updateAddOrUpdate = inject('updateAddOrUpdate')

function getRecruitId(index){
  recruitId.value=props.recruitList[index].recruitId
}

provide('recruitId', recruitId)

function handleUpdateRecruit(index){
  getRecruitId(index)
  updateShowDrawer(true)
  updateDrawerTitle('修改招聘信息')
  updateAddOrUpdate(false)
}

function handleDeleteRecruit(){
  updateLoading(true)
  deleteRecruit({recruitId: recruitId.value}).then(res => {
    if(res.code === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    }else {
      ElMessage({
        type: 'error',
        message: '删除失败'
      })
    }
    updateLoading(false)
    window.location.reload()
  })
}

</script>

<template>
  <div class="recruit-table" v-loading="isLoading">
    <div class="recruit-list">
      <el-table class="table-recruit" ref="table" :data="props.recruitList" >
        <el-table-column label="招聘ID" prop="recruitId" width="120" />
        <el-table-column label="招聘职位" prop="career" width="150" />
        <el-table-column label="招聘类型" prop="type" width="150" />
        <el-table-column label="招聘人数" prop="number" width="120" />
        <el-table-column label="招聘要求" prop="message" width="250" />
        <el-table-column label="薪资水平" prop="salary" width="120" />
        <el-table-column label="是否管吃住" prop="freefl" width="120">
          <template #default="{ row }">
            {{ row.freefl ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="releaseDate" width="120" >
          <template #default="{ row }">
            {{formatDate(new Date(Date.parse(row.releaseDate)),'YY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="handleUpdateRecruit(scope.$index)">修改信息</el-button>
            <el-popconfirm
              title="确认删除？"
              @confirm="handleDeleteRecruit"
              cancel-button-text="取消"
              confirm-button-text="确定"
              confirm-button-type="danger"
            >
              <template #reference>
                <el-button type="text" @click="getRecruitId(scope.$index)">删除信息</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <add-or-up-recruit-drawer />
    </div>
    <div class="pagination">
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
.recruit-table{
  background-color: #f5f5f5;
}
.recruit-list{
  margin-top: 20px;
  margin-bottom: 20px;
}
.pagination{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.table-recruit{
  width: auto;
}
</style>