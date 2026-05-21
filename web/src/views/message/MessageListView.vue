<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createMessage, getMessageList, type MessageItem } from '@/api/message'
import { useAuthStore } from '@/stores/auth'
import { formatDateTime } from '@/utils/format'

const authStore = useAuthStore()
const loading = ref(false)
const submitting = ref(false)
const list = ref<MessageItem[]>([])
const form = reactive({
  feijiId: 0,
  feijiLiuyanContent: '',
})

async function loadMessages() {
  loading.value = true
  try {
    const res = await getMessageList({ page: 1, limit: 20 })
    list.value = res.data?.list || []
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载留言失败')
  } finally {
    loading.value = false
  }
}

async function submitMessage() {
  if (!form.feijiId || !form.feijiLiuyanContent.trim()) {
    ElMessage.warning('请填写航班ID和留言内容')
    return
  }
  submitting.value = true
  try {
    await createMessage({
      feijiId: form.feijiId,
      yonghuId: authStore.userId,
      feijiLiuyanContent: form.feijiLiuyanContent,
    })
    ElMessage.success('留言成功')
    form.feijiLiuyanContent = ''
    await loadMessages()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '留言失败')
  } finally {
    submitting.value = false
  }
}

onMounted(loadMessages)
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <h1>我的留言</h1>
    </div>

    <div class="form-grid single message-form">
      <input v-model.number="form.feijiId" class="input" type="number" placeholder="航班ID" />
      <textarea v-model="form.feijiLiuyanContent" class="input textarea" placeholder="输入留言内容"></textarea>
      <button class="primary-btn" :disabled="submitting" @click="submitMessage">{{ submitting ? '提交中...' : '提交留言' }}</button>
    </div>

    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!list.length" class="empty-state">暂无留言</div>
    <div v-else class="news-list">
      <article v-for="item in list" :key="item.id" class="news-item">
        <h3>航班 #{{ item.feijiId }} · {{ item.yonghuName || '用户' }}</h3>
        <p>{{ item.feijiLiuyanContent }}</p>
        <p class="muted">{{ formatDateTime(item.insertTime) }}</p>
        <p v-if="item.replyContent" class="reply-box"><strong>回复：</strong>{{ item.replyContent }}</p>
      </article>
    </div>
  </section>
</template>
