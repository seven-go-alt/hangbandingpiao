<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  role: 'yonghu' as const,
})

async function submit() {
  loading.value = true
  try {
    await authStore.login(form)
    ElMessage.success('登录成功')
    router.push(String(route.query.redirect || '/'))
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-card">
    <h1>登录</h1>
    <div class="form-grid single">
      <input v-model="form.username" class="input" placeholder="请输入账号" />
      <input v-model="form.password" class="input" placeholder="请输入密码" type="password" />
      <button class="primary-btn" :disabled="loading" @click="submit">{{ loading ? '登录中...' : '登录' }}</button>
      <button class="text-btn" @click="router.push('/register')">没有账号？去注册</button>
    </div>
  </section>
</template>
