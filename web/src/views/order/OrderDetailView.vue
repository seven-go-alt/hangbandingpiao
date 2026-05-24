<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderDetail } from '@/api/order'
import type { OrderItem } from '@/types/api'
import { formatDateTime, formatPrice } from '@/utils/format'

const route = useRoute()
const loading = ref(false)
const order = ref<OrderItem | null>(null)

async function loadDetail() {
  loading.value = true
  try {
    const res = await getOrderDetail(Number(route.params.id))
    order.value = res.data || null
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载订单详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadDetail)
</script>

<template>
  <section class="section-block detail-card">
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!order" class="empty-state">未找到订单</div>
    <div v-else class="detail-content">
      <h1>订单详情</h1>
      <p>订单号：{{ order.feijiOrderUuidNumber || `#${order.id}` }}</p>
      <p>航班：{{ order.feijiName || '—' }}</p>
      <p>路线：{{ order.feijiStartAddress }} → {{ order.feijiEndAddress }}</p>
      <p>出发：{{ formatDateTime(order.feijiStartTime) }}</p>
      <p>下单时间：{{ formatDateTime(order.insertTime) }}</p>
      <p>状态：{{ order.feijiOrderValue || order.feijiOrderTypes || '未知' }}</p>
      <p class="price">{{ formatPrice(order.feijiNewMoney) }}</p>
    </div>
  </section>
</template>
