<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrderList, refundOrder } from '@/api/order'
import type { OrderItem } from '@/types/api'
import { formatDateTime, formatPrice } from '@/utils/format'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const orders = ref<OrderItem[]>([])

async function loadOrders() {
  loading.value = true
  try {
    const res = await getOrderList({ page: 1, limit: 20 })
    orders.value = res.data?.list || []
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载订单失败')
  } finally {
    loading.value = false
  }
}

function getOrderStatus(order: OrderItem) {
  return order.feijiOrderValue || String(order.feijiOrderTypes || '状态未知')
}

function canRefund(order: OrderItem) {
  const status = String(order.feijiOrderValue || order.feijiOrderTypes || '')
  return !/已退款|退款/.test(status)
}

function getOrderStatusClass(order: OrderItem) {
  const status = String(order.feijiOrderValue || order.feijiOrderTypes || '')
  if (/已退款|退款/.test(status)) return 'status-badge is-refunded'
  if (/已支付|已预订|成功|完成/.test(status)) return 'status-badge is-success'
  return 'status-badge is-pending'
}

async function handleRefund(id: number) {
  try {
    await refundOrder(id)
    ElMessage.success('退款成功')
    await loadOrders()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '退款失败')
  }
}

function gotoDetail(id: number) {
  router.push(`/orders/${id}`)
}

onMounted(loadOrders)
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <h1>我的订单</h1>
    </div>
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!orders.length" class="empty-state">暂无订单</div>
    <div v-else class="order-list">
      <article v-for="item in orders" :key="item.id" class="order-card">
        <div>
          <h3>{{ item.feijiName || `订单 #${item.id}` }}</h3>
          <p>{{ item.feijiStartAddress }} → {{ item.feijiEndAddress }}</p>
          <p>出发：{{ formatDateTime(item.feijiStartTime) }}</p>
          <p>下单：{{ formatDateTime(item.insertTime) }}</p>
        </div>
        <div class="order-side">
          <strong>{{ formatPrice(item.feijiNewMoney) }}</strong>
          <span :class="getOrderStatusClass(item)">{{ getOrderStatus(item) }}</span>
          <div class="hero-actions order-actions">
            <button class="ghost-btn" @click="gotoDetail(item.id)">查看详情</button>
            <button class="ghost-btn" :disabled="!canRefund(item)" @click="handleRefund(item.id)">
              {{ canRefund(item) ? '申请退款' : '已退款' }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
