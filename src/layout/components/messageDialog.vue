<script setup>
import { ref, reactive, inject, onMounted, defineProps } from 'vue'
import { deleteByMessageId, deleteReadMessage, updateIsRead } from '@/apis/UserMessage'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/formatDate'
import { Delete } from '@element-plus/icons-vue'

const messageId = ref('')
const isShowDialog = inject('isShowDialog')
const updateShowDialog = inject('updateShowDialog')
const isLoading = inject('isLoading')
const updateLoading = inject('updateLoading')
const props = defineProps({
  userMessageList: { // 用户消息列表
    type: Array,
    default(){
      return []
    }
  },
  allCount: { // 所有消息数量
    type: Number,
    default(){
      return 0
    }
  },
  noReadCount: { // 未读消息数量
    type: Number,
    default(){
      return 0
    }
  }
})

function handleDeleteRead() {
  updateLoading(true)
  ElMessageBox.confirm(
      '确定删除所有已读消息吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    deleteReadMessage().then( res => {
      if (res.code === 200) {
        ElMessage({
          type:'success',
          message: '删除成功'
        })
      }else {
        ElMessage({
          type: 'error',
          message: '删除失败'
        })
      }
    })
    updateLoading(false)
    // 刷新消息列表
    window.location.reload()
    updateShowDialog(true)
  })
}

function getMessageId(index){
  messageId.value = props.userMessageList[index].messageId
}

function deleteMessage(index){
  updateLoading(true)
  getMessageId(index)
  ElMessageBox.confirm(
      '确定删除该消息吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    deleteByMessageId({messageId: messageId.value}).then(res => {
      if (res.code === 200) {
        ElMessage({
          type:'success',
          message: '删除成功'
        })
      }else {
        ElMessage({
          type: 'error',
          message: '删除失败'
        })
      }
    })
    updateLoading(false)
    // 刷新消息列表
    window.location.reload()
    updateShowDialog(true)
  })
}

function handleRead(index){
  updateLoading(true)
  getMessageId(index)
  updateIsRead({messageId: messageId.value}).then(res => {
    if (res.code === 200) {
    }else {
      ElMessage({
        type: 'error',
        message: '服务器错误'
      })
    }
  })
  updateLoading(false)
}

</script>

<template>
  <el-dialog v-model="isShowDialog" title="消息中心" width="50%" center>
    <div class="noRead-delete">
      <el-button type="primary" @click="handleDeleteRead">删除已读</el-button>
    </div>
    <el-collapse accordion v-loading="isLoading" >
      <template v-for="(item, index) in props.userMessageList" :key="index" :class="item">
        <el-collapse-item :title="item.title" :name="item.messageId" @click="handleRead(index)">
          <div class="message">
            <span class="message-sender">发送人: {{ item.companyName }}</span><br>
            <span class="message-content">{{ item.content }}</span><br>
            <span class="message-time">发送时间: {{ formatDate(new Date(item.sendDate), 'YY-MM-DD') }}</span>
          </div>
          <div class="message-delete-icon">
            <el-icon @click="deleteMessage(index)"><Delete /></el-icon>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
  </el-dialog>
</template>

<style scoped>
.noRead-delete {
  margin-bottom: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
.message {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.message-sender {
  color: #333;
  font-size: 14px;
}
.message-content {
  color: #666;
  font-size: 14px;
}
.message-time {
  color: #999;
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.message-delete-icon {
  cursor: pointer;
  font-size: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>