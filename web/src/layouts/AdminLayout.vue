<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { label: '仪表盘', path: '/admin' },
  { label: '用户管理', path: '/admin/users' },
  { label: '航班管理', path: '/admin/flights' },
  { label: '订单管理', path: '/admin/orders' },
]

const pageTitle = computed(() => navItems.find((item) => route.path === item.path)?.label || '管理后台')

function goto(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-brand" @click="goto('/admin')">后台管理</div>
      <nav class="admin-nav">
        <button
          v-for="item in navItems"
          :key="item.path"
          :class="['admin-nav-link', { active: route.path === item.path }]"
          @click="goto(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>
      <button class="ghost-btn admin-back-btn" @click="goto('/')">返回前台</button>
    </aside>

    <section class="admin-main">
      <header class="admin-header">
        <div>
          <p class="section-kicker">ADMIN PANEL</p>
          <h1>{{ pageTitle }}</h1>
        </div>
      </header>
      <RouterView />
    </section>
  </div>
</template>
