<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getFlightDetail } from '@/api/flight'
import { createCollection, hasCollected } from '@/api/collection'
import { formatPrice, pickFirstImage } from '@/utils/format'
import type { FlightItem } from '@/types/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const flight = ref<FlightItem | null>(null)
const loading = ref(false)
const collected = ref(false)

const cover = computed(() => pickFirstImage(flight.value?.feijiPhoto))

async function loadDetail() {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await getFlightDetail(id)
    flight.value = res.data || null
    if (authStore.isLoggedIn && flight.value) {
      collected.value = await hasCollected(flight.value.id)
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载详情失败')
  } finally {
    loading.value = false
  }
}

function createOrder() {
  if (!flight.value) return
  if (!authStore.isLoggedIn) {
    router.push({ name: 'login', query: { redirect: `/orders/create/${flight.value.id}` } })
    return
  }
  router.push(`/orders/create/${flight.value.id}`)
}

async function collectFlight() {
  if (!flight.value) return
  if (!authStore.isLoggedIn) {
    router.push({ name: 'login', query: { redirect: `/flights/${flight.value.id}` } })
    return
  }
  if (collected.value) {
    ElMessage.info('你已经收藏过这个航班了')
    return
  }
  try {
    await createCollection({ feijiId: flight.value.id, yonghuId: authStore.userId })
    collected.value = true
    ElMessage.success('收藏成功')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '收藏失败')
  }
}

function gotoMessages() {
  if (!flight.value) return
  router.push({ path: '/messages', query: { feijiId: String(flight.value.id) } })
}

onMounted(loadDetail)
</script>

<template>
  <section class="section-block detail-card">
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!flight" class="empty-state">未找到航班</div>
    <template v-else>
      <img v-if="cover" :src="cover" class="detail-cover" :alt="flight.feijiName" />
      <div class="detail-content">
        <h1>{{ flight.feijiName }}</h1>
        <p>{{ flight.feijiStartAddress }} → {{ flight.feijiEndAddress }}</p>
        <p>起飞时间：{{ flight.feijiStartTime || '待定' }}</p>
        <p>机型：{{ flight.feijiLeixingValue || flight.feijiLeixingTypes || '—' }}</p>
        <p>类型：{{ flight.feijiValue || flight.feijiTypes || '—' }}</p>
        <p class="price">{{ formatPrice(flight.feijiNewMoney) }}</p>
        <div class="hero-actions">
          <button class="primary-btn" @click="createOrder">立即预订</button>
          <button class="ghost-btn" @click="collectFlight">{{ collected ? '已收藏' : '加入收藏' }}</button>
          <button class="ghost-btn" @click="gotoMessages">留言互动</button>
        </div>
        <div class="rich-text" v-html="flight.feijiContent || '<p>暂无详情</p>'" />
      </div>
    </template>
  </section>
</template>
