<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminOrderDetail, getAdminOrderList, type AdminOrderQuery } from '@/api/admin-order'
import type { OrderItem } from '@/types/api'
import { formatDateTime, formatPrice } from '@/utils/format'

const loading = ref(false)
const detailLoading = ref(false)
const list = ref<OrderItem[]>([])
const selectedOrder = ref<OrderItem | null>(null)
const pager = reactive({ page: 1, limit: 10, total: 0, totalPage: 0 })
const query = reactive<AdminOrderQuery>({
  feijiName: '',
  yonghuName: '',
  yonghuPhone: '',
  feijiOrderUuidNumber: '',
  feijiOrderTypes: '',
})

const canPrev = computed(() => pager.page > 1)
const canNext = computed(() => pager.page < pager.totalPage)

function orderStatusText(item: OrderItem) {
  return item.feijiOrderValue || item.feijiOrderTypes || '—'
}

function orderStatusClass(item: OrderItem) {
  const value = String(item.feijiOrderValue || item.feijiOrderTypes || '')
  if (value.includes('退') || value === '2') return 'status-badge is-refunded'
  return 'status-badge is-success'
}

async function loadOrders(resetPage = false) {
  if (resetPage) pager.page = 1
  loading.value = true
  try {
    const res = await getAdminOrderList({ page: pager.page, limit: pager.limit, ...query })
    list.value = res.data?.list || []
    pager.total = res.data?.totalCount || 0
    pager.totalPage = res.data?.totalPage || 0
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载订单失败')
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  query.feijiName = ''
  query.yonghuName = ''
  query.yonghuPhone = ''
  query.feijiOrderUuidNumber = ''
  query.feijiOrderTypes = ''
  loadOrders(true)
}

async function openDetail(id: number) {
  detailLoading.value = true
  selectedOrder.value = null
  try {
    const res = await getAdminOrderDetail(id)
    selectedOrder.value = res.data || null
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载订单详情失败')
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  selectedOrder.value = null
}

function changePage(step: number) {
  const nextPage = pager.page + step
  if (nextPage < 1 || (pager.totalPage && nextPage > pager.totalPage)) return
  pager.page = nextPage
  loadOrders()
}

function changePageSize(event: Event) {
  pager.limit = Number((event.target as HTMLSelectElement).value)
  loadOrders(true)
}

onMounted(() => loadOrders())
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <div>
        <h2>订单管理</h2>
        <p class="muted">查看订单、乘客、航班和状态信息，暂不提供后台写操作。</p>
      </div>
      <span class="muted">共 {{ pager.total }} 条</span>
    </div>

    <div class="form-grid admin-filter-grid">
      <input v-model="query.feijiOrderUuidNumber" class="input" placeholder="订单号" />
      <input v-model="query.feijiName" class="input" placeholder="航班号" />
      <input v-model="query.yonghuName" class="input" placeholder="乘客姓名" />
      <input v-model="query.yonghuPhone" class="input" placeholder="手机号" />
      <select v-model="query.feijiOrderTypes" class="select">
        <option value="">全部状态</option>
        <option value="1">已支付</option>
        <option value="2">已退款</option>
      </select>
      <button class="primary-btn" @click="loadOrders(true)">查询</button>
      <button class="ghost-btn" @click="resetQuery">重置</button>
    </div>

    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!list.length" class="empty-state">暂无订单</div>
    <template v-else>
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>订单号</th>
              <th>航班号</th>
              <th>乘客</th>
              <th>手机号</th>
              <th>航线</th>
              <th>票价</th>
              <th>状态</th>
              <th>订票日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.feijiOrderUuidNumber || '—' }}</td>
              <td>{{ item.feijiName || '—' }}</td>
              <td>{{ item.yonghuName || '—' }}</td>
              <td>{{ item.yonghuPhone || '—' }}</td>
              <td>{{ item.feijiStartAddress || '—' }} → {{ item.feijiEndAddress || '—' }}</td>
              <td>{{ formatPrice(item.feijiNewMoney) }}</td>
              <td><span :class="orderStatusClass(item)">{{ orderStatusText(item) }}</span></td>
              <td>{{ formatDateTime(item.insertTime) }}</td>
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

    <div v-if="detailLoading || selectedOrder" class="modal-mask" @click.self="closeDetail">
      <article class="modal-card">
        <div class="section-head">
          <div>
            <p class="section-kicker">ORDER DETAIL</p>
            <h2>{{ selectedOrder?.feijiOrderUuidNumber || '订单详情' }}</h2>
          </div>
          <button class="ghost-btn" @click="closeDetail">关闭</button>
        </div>
        <div v-if="detailLoading" class="empty-state">详情加载中...</div>
        <div v-else-if="selectedOrder" class="detail-grid">
          <dl class="info-grid">
            <div><dt>订单 ID</dt><dd>{{ selectedOrder.id }}</dd></div>
            <div><dt>订单号</dt><dd>{{ selectedOrder.feijiOrderUuidNumber || '—' }}</dd></div>
            <div><dt>订单状态</dt><dd><span :class="orderStatusClass(selectedOrder)">{{ orderStatusText(selectedOrder) }}</span></dd></div>
            <div><dt>订票时间</dt><dd>{{ formatDateTime(selectedOrder.insertTime || selectedOrder.createTime) }}</dd></div>
            <div><dt>航班号</dt><dd>{{ selectedOrder.feijiName || '—' }}</dd></div>
            <div><dt>起飞时间</dt><dd>{{ formatDateTime(selectedOrder.feijiStartTime) }}</dd></div>
            <div><dt>始发站</dt><dd>{{ selectedOrder.feijiStartAddress || '—' }}</dd></div>
            <div><dt>目的地</dt><dd>{{ selectedOrder.feijiEndAddress || '—' }}</dd></div>
            <div><dt>票价</dt><dd>{{ formatPrice(selectedOrder.feijiNewMoney) }}</dd></div>
            <div><dt>乘客</dt><dd>{{ selectedOrder.yonghuName || '—' }}</dd></div>
            <div><dt>手机号</dt><dd>{{ selectedOrder.yonghuPhone || '—' }}</dd></div>
            <div><dt>身份证号</dt><dd>{{ selectedOrder.yonghuIdNumber || '—' }}</dd></div>
          </dl>
        </div>
      </article>
    </div>
  </section>
</template>
