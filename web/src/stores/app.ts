import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getConfigList } from '@/api/common'

export const useAppStore = defineStore('app', () => {
  const projectName = ref('航班订票管理网站')
  const banners = ref<string[]>([])

  async function fetchBanners() {
    const res = await getConfigList({ page: 1, limit: 5 })
    banners.value = (res.data?.list || []).map((item) => item.value || '').filter(Boolean)
  }

  return {
    projectName,
    banners,
    fetchBanners,
  }
})
