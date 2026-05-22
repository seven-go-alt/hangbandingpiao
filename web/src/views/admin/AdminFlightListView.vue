<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminFlightList, type AdminFlightQuery } from '@/api/admin-flight'
import type { FlightItem } from '@/types/api'
import { formatDateTime, formatPrice } from '@/utils/format'

const loading = ref(false)
const list = ref<FlightItem[]>([])
const pager = reactive({ page: 1, limit: 10, total: 0 })
const query = reactive<AdminFlightQuery>({ feijiName: '', feijiStartAddress: '', feijiEndAddress: '' })

async function loadFlights() {
  loading.value = true
  try {
    const res = await getAdminFlightList({ page: pager.page, limit: pager.limit, ...query })
    list.value = res.data?.list || []
    pager.total = res.data?.totalCount || 0
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载航班失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadFlights)
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <h2>航班管理</h2>
      <span class="muted">共 {{ pager.total }} 条</span>
    </div>
    <div class="form-grid">
      <input v-model="query.feijiName" class="input" placeholder="航班号" />
      <input v-model="query.feijiStartAddress" class="input" placeholder="始发站" />
      <input v-model="query.feijiEndAddress" class="input" placeholder="目的地" />
      <button class="primary-btn" @click="loadFlights">查询</button>
    </div>
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!list.length" class="empty-state">暂无航班</div>
    <div v-else class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>航班号</th>
            <th>始发站</th>
            <th>目的地</th>
            <th>起飞时间</th>
            <th>票价</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.feijiName }}</td>
            <td>{{ item.feijiStartAddress || '—' }}</td>
            <td>{{ item.feijiEndAddress || '—' }}</td>
            <td>{{ formatDateTime(item.feijiStartTime) }}</td>
            <td>{{ formatPrice(item.feijiNewMoney) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
