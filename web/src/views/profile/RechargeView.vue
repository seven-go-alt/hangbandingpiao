<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const authStore = useAuthStore()
const balanceText = computed(() => formatPrice(authStore.profile?.newMoney))

onMounted(() => {
  authStore.fetchSession().catch(() => undefined)
})
</script>

<template>
  <section class="section-block detail-card">
    <div class="detail-content">
      <h1>充值说明</h1>
      <p>当前账户余额：<strong>{{ balanceText }}</strong></p>
      <p>
        当前后端没有提供独立的在线充值接口，因此前端暂时无法直接发起充值支付。
        目前余额变化来自两类后端已存在能力：
      </p>
      <ul class="info-list">
        <li>下单成功后，系统会自动扣减余额</li>
        <li>订单退款成功后，系统会自动返还余额</li>
      </ul>
      <p class="muted">
        如果你现在余额不足，可以先联系管理员在后台调整用户余额，之后再回到下单流程继续预订。
      </p>
      <div class="hero-actions">
        <button class="primary-btn" @click="router.push('/profile')">返回个人中心</button>
        <button class="ghost-btn" @click="router.push('/orders')">查看我的订单</button>
      </div>
    </div>
  </section>
</template>
