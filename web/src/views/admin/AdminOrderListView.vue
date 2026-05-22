<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminOrderList, type AdminOrderQuery } from '@/api/admin-order'
import type { OrderItem } from '@/types/api'
import { formatDateTime, formatPrice } from '@/utils/format'

const loading = ref(false)
const list = ref<OrderItem[]>([])
const pager = reactive({ page: 1, limit: 10, total: 0 })
const query = reactive<AdminOrderQuery>({ feijiName: '', yonghuName: '', yonghuPhone: '' })

async function loadOrders() {
  loading.value = true
  try {
    const res = await getAdminOrderList({ page: pager.page, limit: pager.limit, ...query })
    list.value = res.data?.list || []
    pager.total = res.data?.totalCount || 0
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载订单失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <h2>订单管理</h2>
      <span class="muted">共 {{ pager.total }} 条</span>
    </div>
    <div class="form-grid">
      <input v-model="query.feijiName" class="input" placeholder="航班号" />
      <input v-model="query.yonghuName" class="input" placeholder="姓名" />
      <input v-model="query.yonghuPhone" class="input" placeholder="手机号" />
      <button class="primary-btn" @click="loadOrders">查询</button>
    </div>
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!list.length" class="empty-state">暂无订单</div>
    <div v-else class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>航班号</th>
            <th>乘客</th>
            <th>手机号</th>
            <th>票价</th>
            <th>订单状态</th>
            <th>订票日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.feijiName || '—' }}</td>
            <td>{{ item.yonghuName || '—' }}</td>
            <td>{{ item.yonghuPhone || '—' }}</td>
            <td>{{ formatPrice(item.feijiNewMoney) }}</td>
            <td>{{ item.feijiOrderValue || item.feijiOrderTypes || '—' }}</td>
            <td>{{ formatDateTime(item.insertTime) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
