<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { updateProfile } from '@/api/user'
import { formatPrice } from '@/utils/format'

const authStore = useAuthStore()
const saving = ref(false)
const form = reactive({
  id: 0,
  username: '',
  yonghuName: '',
  yonghuPhone: '',
  yonghuIdNumber: '',
  sexTypes: 2,
})

const balanceText = computed(() => formatPrice(authStore.profile?.newMoney))

async function syncProfile() {
  const profile = await authStore.fetchSession()
  if (!profile) return
  form.id = profile.id
  form.username = profile.username || ''
  form.yonghuName = profile.yonghuName || ''
  form.yonghuPhone = profile.yonghuPhone || ''
  form.yonghuIdNumber = profile.yonghuIdNumber || ''
  form.sexTypes = Number(profile.sexTypes || 2)
}

async function saveProfile() {
  saving.value = true
  try {
    await updateProfile({ ...form })
    ElMessage.success('资料已更新')
    await syncProfile()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  syncProfile().catch(() => undefined)
})
</script>

<template>
  <section class="section-block detail-card">
    <div class="detail-content">
      <h1>个人中心</h1>
      <p>当前余额：<strong>{{ balanceText }}</strong></p>
      <div class="form-grid profile-grid">
        <input v-model="form.username" class="input" placeholder="账号" disabled />
        <input v-model="form.yonghuName" class="input" placeholder="姓名" />
        <input v-model="form.yonghuPhone" class="input" placeholder="手机号" />
        <input v-model="form.yonghuIdNumber" class="input" placeholder="身份证号" />
        <select v-model="form.sexTypes" class="input">
          <option :value="1">男</option>
          <option :value="2">女</option>
        </select>
      </div>
      <div class="hero-actions">
        <button class="primary-btn" :disabled="saving" @click="saveProfile">{{ saving ? '保存中...' : '保存资料' }}</button>
        <button class="ghost-btn" @click="$router.push('/recharge')">去充值说明页</button>
      </div>
    </div>
  </section>
</template>
