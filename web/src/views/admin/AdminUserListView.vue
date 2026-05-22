<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminUserList, type AdminUserQuery } from '@/api/admin-user'
import type { AdminUserItem } from '@/types/api'
import { formatPrice } from '@/utils/format'

const loading = ref(false)
const list = ref<AdminUserItem[]>([])
const pager = reactive({ page: 1, limit: 10, total: 0 })
const query = reactive<AdminUserQuery>({ username: '', yonghuName: '', yonghuPhone: '' })

async function loadUsers() {
  loading.value = true
  try {
    const res = await getAdminUserList({ page: pager.page, limit: pager.limit, ...query })
    list.value = res.data?.list || []
    pager.total = res.data?.totalCount || 0
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载用户失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <section class="section-block">
    <div class="section-head">
      <h2>用户管理</h2>
      <span class="muted">共 {{ pager.total }} 条</span>
    </div>
    <div class="form-grid">
      <input v-model="query.username" class="input" placeholder="账号" />
      <input v-model="query.yonghuName" class="input" placeholder="姓名" />
      <input v-model="query.yonghuPhone" class="input" placeholder="手机号" />
      <button class="primary-btn" @click="loadUsers">查询</button>
    </div>
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!list.length" class="empty-state">暂无用户</div>
    <div v-else class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>账号</th>
            <th>姓名</th>
            <th>手机号</th>
            <th>身份证号</th>
            <th>余额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.yonghuName || '—' }}</td>
            <td>{{ item.yonghuPhone || '—' }}</td>
            <td>{{ item.yonghuIdNumber || '—' }}</td>
            <td>{{ formatPrice(item.newMoney) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
