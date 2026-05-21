<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { deleteCollection, getCollectionList, type CollectionItem } from '@/api/collection'
import { formatDateTime, formatPrice, pickFirstImage } from '@/utils/format'

const loading = ref(false)
const list = ref<CollectionItem[]>([])

async function loadCollections() {
  loading.value = true
  try {
    const res = await getCollectionList({ page: 1, limit: 20 })
    list.value = res.data?.list || []
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载收藏失败')
  } finally {
    loading.value = false
  }
}

async function removeItem(id: number) {
  try {
    await deleteCollection([id])
    ElMessage.success('已取消收藏')
    await loadCollections()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '取消收藏失败')
  }
}

onMounted(loadCollections)
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <h1>我的收藏</h1>
    </div>
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!list.length" class="empty-state">暂无收藏</div>
    <div v-else class="order-list">
      <article v-for="item in list" :key="item.id" class="order-card">
        <div class="collection-main">
          <img v-if="pickFirstImage(item.feijiPhoto)" :src="pickFirstImage(item.feijiPhoto)" class="collection-thumb" />
          <div>
            <h3>{{ item.feijiName }}</h3>
            <p>{{ item.feijiStartAddress }} → {{ item.feijiEndAddress }}</p>
            <p>出发：{{ formatDateTime(item.feijiStartTime) }}</p>
          </div>
        </div>
        <div class="order-side">
          <strong>{{ formatPrice(item.feijiNewMoney) }}</strong>
          <button class="ghost-btn" @click="removeItem(item.id)">取消收藏</button>
        </div>
      </article>
    </div>
  </section>
</template>
