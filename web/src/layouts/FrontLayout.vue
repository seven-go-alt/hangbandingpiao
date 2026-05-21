<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const isHome = computed(() => route.name === 'home')

function goto(path: string) {
  router.push(path)
}

async function handleLogout() {
  await authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}

appStore.fetchBanners().catch(() => undefined)
</script>

<template>
  <div class="layout-shell">
    <header class="topbar">
      <div class="brand" @click="goto('/')">{{ appStore.projectName }}</div>
      <nav class="nav">
        <button :class="['nav-link', { active: isHome }]" @click="goto('/')">首页</button>
        <button :class="['nav-link', { active: route.path.startsWith('/flights') }]" @click="goto('/flights')">航班</button>
        <button :class="['nav-link', { active: route.path.startsWith('/news') }]" @click="goto('/news')">新闻</button>
        <button v-if="authStore.isLoggedIn" :class="['nav-link', { active: route.path.startsWith('/orders') }]" @click="goto('/orders')">我的订单</button>
        <button v-if="authStore.isLoggedIn" :class="['nav-link', { active: route.path.startsWith('/collections') }]" @click="goto('/collections')">我的收藏</button>
        <button v-if="authStore.isLoggedIn" :class="['nav-link', { active: route.path.startsWith('/messages') }]" @click="goto('/messages')">我的留言</button>
        <button v-if="authStore.isLoggedIn" :class="['nav-link', { active: route.path.startsWith('/profile') }]" @click="goto('/profile')">个人中心</button>
      </nav>
      <div class="actions">
        <template v-if="authStore.isLoggedIn">
          <span class="welcome">你好，{{ authStore.profile?.yonghuName || authStore.username }}</span>
          <button class="ghost-btn" @click="handleLogout">退出</button>
        </template>
        <template v-else>
          <button class="ghost-btn" @click="goto('/login')">登录</button>
          <button class="primary-btn" @click="goto('/register')">注册</button>
        </template>
      </div>
    </header>

    <main class="page-main">
      <RouterView />
    </main>
  </div>
</template>
