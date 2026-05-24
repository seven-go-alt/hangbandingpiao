<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminFlightDetail, getAdminFlightList, type AdminFlightQuery } from '@/api/admin-flight'
import type { FlightItem } from '@/types/api'
import { formatDateTime, formatPrice, pickFirstImage } from '@/utils/format'

const loading = ref(false)
const detailLoading = ref(false)
const list = ref<FlightItem[]>([])
const selectedFlight = ref<FlightItem | null>(null)
const pager = reactive({ page: 1, limit: 10, total: 0, totalPage: 0 })
const query = reactive<AdminFlightQuery>({
  feijiName: '',
  feijiStartAddress: '',
  feijiEndAddress: '',
  feijiNewMoneyStart: '',
  feijiNewMoneyEnd: '',
})

const canPrev = computed(() => pager.page > 1)
const canNext = computed(() => pager.page < pager.totalPage)

async function loadFlights(resetPage = false) {
  if (resetPage) pager.page = 1
  loading.value = true
  try {
    const res = await getAdminFlightList({ page: pager.page, limit: pager.limit, ...query })
    list.value = res.data?.list || []
    pager.total = res.data?.totalCount || 0
    pager.totalPage = res.data?.totalPage || 0
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载航班失败')
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  query.feijiName = ''
  query.feijiStartAddress = ''
  query.feijiEndAddress = ''
  query.feijiNewMoneyStart = ''
  query.feijiNewMoneyEnd = ''
  loadFlights(true)
}

async function openDetail(id: number) {
  detailLoading.value = true
  selectedFlight.value = null
  try {
    const res = await getAdminFlightDetail(id)
    selectedFlight.value = res.data || null
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载航班详情失败')
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  selectedFlight.value = null
}

function changePage(step: number) {
  const nextPage = pager.page + step
  if (nextPage < 1 || (pager.totalPage && nextPage > pager.totalPage)) return
  pager.page = nextPage
  loadFlights()
}

function changePageSize(event: Event) {
  pager.limit = Number((event.target as HTMLSelectElement).value)
  loadFlights(true)
}

onMounted(() => loadFlights())
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <div>
        <h2>航班管理</h2>
        <p class="muted">查看航班列表、价格区间、航线信息和详情内容。</p>
      </div>
      <span class="muted">共 {{ pager.total }} 条</span>
    </div>

    <div class="form-grid admin-filter-grid">
      <input v-model="query.feijiName" class="input" placeholder="航班号" />
      <input v-model="query.feijiStartAddress" class="input" placeholder="始发站" />
      <input v-model="query.feijiEndAddress" class="input" placeholder="目的地" />
      <input v-model="query.feijiNewMoneyStart" class="input" type="number" min="0" placeholder="最低票价" />
      <input v-model="query.feijiNewMoneyEnd" class="input" type="number" min="0" placeholder="最高票价" />
      <button class="primary-btn" @click="loadFlights(true)">查询</button>
      <button class="ghost-btn" @click="resetQuery">重置</button>
    </div>

    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!list.length" class="empty-state">暂无航班</div>
    <template v-else>
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>航班号</th>
              <th>飞机</th>
              <th>类型</th>
              <th>始发站</th>
              <th>目的地</th>
              <th>起飞时间</th>
              <th>票价</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.feijiName }}</td>
              <td>{{ item.feijiValue || item.feijiTypes || '—' }}</td>
              <td>{{ item.feijiLeixingValue || item.feijiLeixingTypes || '—' }}</td>
              <td>{{ item.feijiStartAddress || '—' }}</td>
              <td>{{ item.feijiEndAddress || '—' }}</td>
              <td>{{ formatDateTime(item.feijiStartTime) }}</td>
              <td>{{ formatPrice(item.feijiNewMoney) }}</td>
              <td><button class="text-btn" @click="openDetail(item.id)">查看详情</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pager-bar">
        <label class="muted">
          每页
          <select :value="pager.limit" class="select" @change="changePageSize">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
          条
        </label>
        <div class="pager-actions">
          <button class="ghost-btn" :disabled="!canPrev" @click="changePage(-1)">上一页</button>
          <span class="muted">第 {{ pager.page }} / {{ pager.totalPage || 1 }} 页</span>
          <button class="ghost-btn" :disabled="!canNext" @click="changePage(1)">下一页</button>
        </div>
      </div>
    </template>

    <div v-if="detailLoading || selectedFlight" class="modal-mask" @click.self="closeDetail">
      <article class="modal-card">
        <div class="section-head">
          <div>
            <p class="section-kicker">FLIGHT DETAIL</p>
            <h2>{{ selectedFlight?.feijiName || '加载中...' }}</h2>
          </div>
          <button class="ghost-btn" @click="closeDetail">关闭</button>
        </div>
        <div v-if="detailLoading" class="empty-state">详情加载中...</div>
        <div v-else-if="selectedFlight" class="detail-grid">
          <img v-if="pickFirstImage(selectedFlight.feijiPhoto)" class="detail-image" :src="pickFirstImage(selectedFlight.feijiPhoto)" :alt="selectedFlight.feijiName" />
          <dl class="info-grid">
            <div><dt>飞机</dt><dd>{{ selectedFlight.feijiValue || selectedFlight.feijiTypes || '—' }}</dd></div>
            <div><dt>飞机类型</dt><dd>{{ selectedFlight.feijiLeixingValue || selectedFlight.feijiLeixingTypes || '—' }}</dd></div>
            <div><dt>起飞时间</dt><dd>{{ formatDateTime(selectedFlight.feijiStartTime) }}</dd></div>
            <div><dt>始发站</dt><dd>{{ selectedFlight.feijiStartAddress || '—' }}</dd></div>
            <div><dt>目的地</dt><dd>{{ selectedFlight.feijiEndAddress || '—' }}</dd></div>
            <div><dt>票价</dt><dd>{{ formatPrice(selectedFlight.feijiNewMoney) }}</dd></div>
          </dl>
          <div class="content-box" v-html="selectedFlight.feijiContent || '暂无详情'" />
        </div>
      </article>
    </div>
  </section>
</template>
