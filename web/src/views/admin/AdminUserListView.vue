<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminUserDetail, getAdminUserList, type AdminUserQuery } from '@/api/admin-user'
import type { AdminUserItem } from '@/types/api'
import { formatDateTime, formatPrice, pickFirstImage } from '@/utils/format'

const loading = ref(false)
const detailLoading = ref(false)
const list = ref<AdminUserItem[]>([])
const selectedUser = ref<AdminUserItem | null>(null)
const pager = reactive({ page: 1, limit: 10, total: 0, totalPage: 0 })
const query = reactive<AdminUserQuery>({
  username: '',
  yonghuName: '',
  yonghuPhone: '',
  yonghuIdNumber: '',
  sexTypes: '',
})

const canPrev = computed(() => pager.page > 1)
const canNext = computed(() => pager.page < pager.totalPage)

function sexText(item: AdminUserItem) {
  return item.sexValue || item.sexTypes || '—'
}

async function loadUsers(resetPage = false) {
  if (resetPage) pager.page = 1
  loading.value = true
  try {
    const res = await getAdminUserList({ page: pager.page, limit: pager.limit, ...query })
    list.value = res.data?.list || []
    pager.total = res.data?.totalCount || 0
    pager.totalPage = res.data?.totalPage || 0
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载用户失败')
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  query.username = ''
  query.yonghuName = ''
  query.yonghuPhone = ''
  query.yonghuIdNumber = ''
  query.sexTypes = ''
  loadUsers(true)
}

async function openDetail(id: number) {
  detailLoading.value = true
  selectedUser.value = null
  try {
    const res = await getAdminUserDetail(id)
    selectedUser.value = res.data || null
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载用户详情失败')
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  selectedUser.value = null
}

function changePage(step: number) {
  const nextPage = pager.page + step
  if (nextPage < 1 || (pager.totalPage && nextPage > pager.totalPage)) return
  pager.page = nextPage
  loadUsers()
}

function changePageSize(event: Event) {
  pager.limit = Number((event.target as HTMLSelectElement).value)
  loadUsers(true)
}

onMounted(() => loadUsers())
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <div>
        <h2>用户管理</h2>
        <p class="muted">查看用户账户、身份信息和余额，暂不提供后台编辑/删除。</p>
      </div>
      <span class="muted">共 {{ pager.total }} 条</span>
    </div>

    <div class="form-grid admin-filter-grid">
      <input v-model="query.username" class="input" placeholder="账号" />
      <input v-model="query.yonghuName" class="input" placeholder="姓名" />
      <input v-model="query.yonghuPhone" class="input" placeholder="手机号" />
      <input v-model="query.yonghuIdNumber" class="input" placeholder="身份证号" />
      <select v-model="query.sexTypes" class="select">
        <option value="">全部性别</option>
        <option value="1">男</option>
        <option value="2">女</option>
      </select>
      <button class="primary-btn" @click="loadUsers(true)">查询</button>
      <button class="ghost-btn" @click="resetQuery">重置</button>
    </div>

    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!list.length" class="empty-state">暂无用户</div>
    <template v-else>
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>账号</th>
              <th>姓名</th>
              <th>性别</th>
              <th>手机号</th>
              <th>身份证号</th>
              <th>余额</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.username }}</td>
              <td>{{ item.yonghuName || '—' }}</td>
              <td>{{ sexText(item) }}</td>
              <td>{{ item.yonghuPhone || '—' }}</td>
              <td>{{ item.yonghuIdNumber || '—' }}</td>
              <td>{{ formatPrice(item.newMoney) }}</td>
              <td>{{ formatDateTime(item.createTime) }}</td>
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

    <div v-if="detailLoading || selectedUser" class="modal-mask" @click.self="closeDetail">
      <article class="modal-card">
        <div class="section-head">
          <div>
            <p class="section-kicker">USER DETAIL</p>
            <h2>{{ selectedUser?.yonghuName || selectedUser?.username || '用户详情' }}</h2>
          </div>
          <button class="ghost-btn" @click="closeDetail">关闭</button>
        </div>
        <div v-if="detailLoading" class="empty-state">详情加载中...</div>
        <div v-else-if="selectedUser" class="detail-grid">
          <img v-if="pickFirstImage(selectedUser.yonghuPhoto)" class="avatar-large" :src="pickFirstImage(selectedUser.yonghuPhoto)" :alt="selectedUser.yonghuName || selectedUser.username" />
          <dl class="info-grid">
            <div><dt>用户 ID</dt><dd>{{ selectedUser.id }}</dd></div>
            <div><dt>账号</dt><dd>{{ selectedUser.username }}</dd></div>
            <div><dt>姓名</dt><dd>{{ selectedUser.yonghuName || '—' }}</dd></div>
            <div><dt>性别</dt><dd>{{ sexText(selectedUser) }}</dd></div>
            <div><dt>手机号</dt><dd>{{ selectedUser.yonghuPhone || '—' }}</dd></div>
            <div><dt>身份证号</dt><dd>{{ selectedUser.yonghuIdNumber || '—' }}</dd></div>
            <div><dt>余额</dt><dd>{{ formatPrice(selectedUser.newMoney) }}</dd></div>
            <div><dt>创建时间</dt><dd>{{ formatDateTime(selectedUser.createTime) }}</dd></div>
          </dl>
        </div>
      </article>
    </div>
  </section>
</template>
