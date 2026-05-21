<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getNewsList } from '@/api/news'
import type { NewsItem } from '@/types/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const list = ref<NewsItem[]>([])

async function loadNews() {
  loading.value = true
  try {
    const res = await getNewsList({ page: 1, limit: 12 })
    list.value = res.data?.list || []
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载新闻失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadNews)
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <h1>新闻公告</h1>
    </div>
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!list.length" class="empty-state">暂无新闻</div>
    <div v-else class="news-list">
      <article v-for="item in list" :key="item.id" class="news-item" @click="router.push(`/news/${item.id}`)">
        <h3>{{ item.newsName }}</h3>
        <p class="news-text">{{ item.newsContent?.replace(/<[^>]+>/g, '').slice(0, 120) || '暂无内容' }}</p>
      </article>
    </div>
  </section>
</template>
