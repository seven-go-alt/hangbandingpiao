<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAdminUserList } from '@/api/admin-user'
import { getAdminFlightList } from '@/api/admin-flight'
import { getAdminOrderList } from '@/api/admin-order'

const userCount = ref(0)
const flightCount = ref(0)
const orderCount = ref(0)

const cards = computed(() => [
  { label: '用户总数', value: userCount.value },
  { label: '航班总数', value: flightCount.value },
  { label: '订单总数', value: orderCount.value },
])

onMounted(async () => {
  const [users, flights, orders] = await Promise.all([
    getAdminUserList({ page: 1, limit: 1 }),
    getAdminFlightList({ page: 1, limit: 1 }),
    getAdminOrderList({ page: 1, limit: 1 }),
  ])
  userCount.value = users.data?.totalCount || 0
  flightCount.value = flights.data?.totalCount || 0
  orderCount.value = orders.data?.totalCount || 0
})
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <div>
        <h2>概览</h2>
        <p class="muted">先搭最小后台骨架，优先覆盖管理端常用查看场景。</p>
      </div>
    </div>
    <div class="hero-stats">
      <div v-for="card in cards" :key="card.label" class="stat-card">
        <strong>{{ card.value }}</strong>
        <span>{{ card.label }}</span>
      </div>
    </div>
  </section>
</template>
