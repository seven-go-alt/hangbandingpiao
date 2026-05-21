<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getNewsDetail } from '@/api/news'
import type { NewsItem } from '@/types/api'

const route = useRoute()
const loading = ref(false)
const item = ref<NewsItem | null>(null)

async function loadDetail() {
  loading.value = true
  try {
    const res = await getNewsDetail(Number(route.params.id))
    item.value = res.data || null
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载新闻详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadDetail)
</script>

<template>
  <section class="section-block detail-card">
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!item" class="empty-state">未找到新闻</div>
    <article v-else class="detail-content">
      <h1>{{ item.newsName }}</h1>
      <div class="rich-text" v-html="item.newsContent || '<p>暂无内容</p>'" />
    </article>
  </section>
</template>
