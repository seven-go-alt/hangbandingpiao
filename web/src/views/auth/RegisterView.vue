<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/auth'

const router = useRouter()
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  yonghuName: '',
  yonghuPhone: '',
  yonghuIdNumber: '',
  sexTypes: 2,
})

async function submit() {
  loading.value = true
  try {
    await register(form)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-card">
    <h1>用户注册</h1>
    <div class="form-grid">
      <input v-model="form.username" class="input" placeholder="账号" />
      <input v-model="form.password" class="input" placeholder="密码" type="password" />
      <input v-model="form.yonghuName" class="input" placeholder="姓名" />
      <input v-model="form.yonghuPhone" class="input" placeholder="手机号" />
      <input v-model="form.yonghuIdNumber" class="input" placeholder="身份证号" />
      <select v-model="form.sexTypes" class="input">
        <option :value="1">男</option>
        <option :value="2">女</option>
      </select>
      <button class="primary-btn" :disabled="loading" @click="submit">{{ loading ? '提交中...' : '注册' }}</button>
    </div>
  </section>
</template>
