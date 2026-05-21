<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  modelValue: {
    feijiName?: string
    feijiStartAddress?: string
    feijiEndAddress?: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { feijiName?: string; feijiStartAddress?: string; feijiEndAddress?: string }): void
  (e: 'search'): void
}>()

const form = reactive({
  feijiName: '',
  feijiStartAddress: '',
  feijiEndAddress: '',
})

watch(
  () => props.modelValue,
  (value) => Object.assign(form, value || {}),
  { immediate: true, deep: true },
)

function submit() {
  emit('update:modelValue', { ...form })
  emit('search')
}
</script>

<template>
  <div class="filter-panel">
    <input v-model="form.feijiName" placeholder="航班号" class="input" />
    <input v-model="form.feijiStartAddress" placeholder="始发站" class="input" />
    <input v-model="form.feijiEndAddress" placeholder="目的地" class="input" />
    <button class="primary-btn" @click="submit">搜索</button>
  </div>
</template>
