<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import FlightCard from '@/components/business/FlightCard.vue'
import FlightFilter from '@/components/business/FlightFilter.vue'
import { getFlightList } from '@/api/flight'
import type { FlightItem } from '@/types/api'

const flights = ref<FlightItem[]>([])
const loading = ref(false)
const pager = reactive({ page: 1, limit: 9, total: 0 })
const query = reactive({ feijiName: '', feijiStartAddress: '', feijiEndAddress: '' })

async function loadFlights() {
  loading.value = true
  try {
    const res = await getFlightList({
      page: pager.page,
      limit: pager.limit,
      ...query,
    })
    flights.value = res.data?.list || []
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
      <h1>航班列表</h1>
      <span class="muted">共 {{ pager.total }} 条</span>
    </div>
    <FlightFilter v-model="query" @search="loadFlights" />
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!flights.length" class="empty-state">暂无航班</div>
    <div v-else class="flight-grid">
      <FlightCard v-for="item in flights" :key="item.id" :flight="item" />
    </div>
  </section>
</template>
