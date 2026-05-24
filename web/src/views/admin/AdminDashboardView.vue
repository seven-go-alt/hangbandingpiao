<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAdminUserList } from '@/api/admin-user'
import { getAdminFlightList } from '@/api/admin-flight'
import { getAdminOrderList } from '@/api/admin-order'
import type { OrderItem } from '@/types/api'
import { formatDateTime, formatPrice } from '@/utils/format'

const loading = ref(false)
const userCount = ref(0)
const flightCount = ref(0)
const orderCount = ref(0)
const recentOrders = ref<OrderItem[]>([])

const cards = computed(() => [
  { label: '用户总数', value: userCount.value, to: '/admin/users', hint: '查看用户资料与余额' },
  { label: '航班总数', value: flightCount.value, to: '/admin/flights', hint: '查看航线、票价和详情' },
  { label: '订单总数', value: orderCount.value, to: '/admin/orders', hint: '查看订单状态与乘客信息' },
])

async function loadDashboard() {
  loading.value = true
  try {
    const [users, flights, orders] = await Promise.all([
      getAdminUserList({ page: 1, limit: 1 }),
      getAdminFlightList({ page: 1, limit: 1 }),
      getAdminOrderList({ page: 1, limit: 5 }),
    ])
    userCount.value = users.data?.totalCount || 0
    flightCount.value = flights.data?.totalCount || 0
    orderCount.value = orders.data?.totalCount || 0
    recentOrders.value = orders.data?.list || []
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <div>
        <h2>概览</h2>
        <p class="muted">后台当前以安全只读为主，覆盖用户、航班、订单的常用查看场景。</p>
      </div>
      <button class="ghost-btn" :disabled="loading" @click="loadDashboard">刷新</button>
    </div>

    <div class="hero-stats">
      <RouterLink v-for="card in cards" :key="card.label" class="stat-card stat-card-link" :to="card.to">
        <strong>{{ card.value }}</strong>
        <span>{{ card.label }}</span>
        <small>{{ card.hint }}</small>
      </RouterLink>
    </div>
  </section>

  <section class="section-block">
    <div class="section-head">
      <div>
        <p class="section-kicker">RECENT ORDERS</p>
        <h2>最近订单</h2>
      </div>
      <RouterLink class="text-btn" to="/admin/orders">查看全部</RouterLink>
    </div>

    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!recentOrders.length" class="empty-state">暂无订单</div>
    <div v-else class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>航班</th>
            <th>乘客</th>
            <th>票价</th>
            <th>状态</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in recentOrders" :key="item.id">
            <td>{{ item.feijiOrderUuidNumber || '—' }}</td>
            <td>{{ item.feijiName || '—' }}</td>
            <td>{{ item.yonghuName || '—' }}</td>
            <td>{{ formatPrice(item.feijiNewMoney) }}</td>
            <td>{{ item.feijiOrderValue || item.feijiOrderTypes || '—' }}</td>
            <td>{{ formatDateTime(item.insertTime) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="section-block">
    <div class="section-head">
      <div>
        <p class="section-kicker">SAFE MODE</p>
        <h2>当前安全边界</h2>
      </div>
    </div>
    <ul class="info-list">
      <li>后台 Vue 页面当前只接入分页查询和详情查看接口。</li>
      <li>暂不提供新增、编辑、删除、退款等写操作，避免误触后端管理能力。</li>
      <li>后续若要开放写操作，建议逐个确认接口语义、权限和表单校验。</li>
    </ul>
  </section>
</template>
