<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createOrder } from '@/api/order'
import { getFlightDetail } from '@/api/flight'
import { useAuthStore } from '@/stores/auth'
import { formatPrice } from '@/utils/format'
import type { FlightItem } from '@/types/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const flight = ref<FlightItem | null>(null)
const loading = ref(false)

const tradeNo = computed(() => `${Date.now()}${Math.floor(Math.random() * 100000)}`)

async function loadFlight() {
  const res = await getFlightDetail(Number(route.params.flightId))
  flight.value = res.data || null
}

async function submitOrder() {
  if (!flight.value) return
  loading.value = true
  try {
    await createOrder({
      feijiId: flight.value.id,
      feijiOrderUuidNumber: tradeNo.value,
      yonghuId: authStore.userId,
    })
    ElMessage.success('预订成功')
    router.push('/orders')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '预订失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadFlight()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载航班失败')
  }
})
</script>

<template>
  <section class="section-block detail-card">
    <div v-if="!flight" class="empty-state">加载航班信息中...</div>
    <div v-else class="detail-content">
      <h1>确认预订</h1>
      <p>航班：{{ flight.feijiName }}</p>
      <p>路线：{{ flight.feijiStartAddress }} → {{ flight.feijiEndAddress }}</p>
      <p>价格：{{ formatPrice(flight.feijiNewMoney) }}</p>
      <p>订单号：{{ tradeNo }}</p>
      <button class="primary-btn" :disabled="loading" @click="submitOrder">{{ loading ? '提交中...' : '确认支付并下单' }}</button>
    </div>
  </section>
</template>
