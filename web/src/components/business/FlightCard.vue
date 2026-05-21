<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatPrice, pickFirstImage } from '@/utils/format'
import type { FlightItem } from '@/types/api'

const props = defineProps<{
  flight: FlightItem
}>()

const router = useRouter()
const cover = computed(() => pickFirstImage(props.flight.feijiPhoto))

function goDetail() {
  router.push(`/flights/${props.flight.id}`)
}
</script>

<template>
  <article class="flight-card" @click="goDetail">
    <img v-if="cover" :src="cover" :alt="flight.feijiName" class="flight-card__image" />
    <div v-else class="flight-card__image flight-card__placeholder">暂无图片</div>
    <div class="flight-card__body">
      <h3>{{ flight.feijiName }}</h3>
      <p>{{ flight.feijiStartAddress }} → {{ flight.feijiEndAddress }}</p>
      <p>{{ flight.feijiStartTime || '时间待定' }}</p>
      <strong>{{ formatPrice(flight.feijiNewMoney) }}</strong>
    </div>
  </article>
</template>
