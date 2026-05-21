<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formatPrice } from '@/utils/format'

const authStore = useAuthStore()
const balanceText = computed(() => formatPrice(authStore.profile?.newMoney))
</script>

<template>
  <section class="section-block detail-card">
    <div class="detail-content">
      <h1>充值说明</h1>
      <p>当前余额：<strong>{{ balanceText }}</strong></p>
      <p>现有后端没有独立的前台充值 API 封装，这一版先保留说明页。</p>
      <p>如果要补完整充值流程，建议下一步新增专用充值接口，避免直接绕过业务规则更新余额。</p>
      <p>临时方案可由后台管理端或数据库初始化数据处理余额。</p>
    </div>
  </section>
</template>
