<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { getFlightList } from '@/api/flight'
import { getNewsList } from '@/api/news'
import { formatPrice, pickFirstImage } from '@/utils/format'
import type { FlightItem, NewsItem } from '@/types/api'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const router = useRouter()
const flights = ref<FlightItem[]>([])
const newsList = ref<NewsItem[]>([])

async function loadData() {
  const [flightRes, newsRes] = await Promise.all([
    getFlightList({ page: 1, limit: 6, flag: 1 }),
    getNewsList({ page: 1, limit: 4 }),
  ])
  flights.value = flightRes.data?.list || []
  newsList.value = newsRes.data?.list || []
}

onMounted(async () => {
  await Promise.all([appStore.fetchBanners(), loadData()])
})
</script>

<template>
  <section class="hero hero--enhanced">
    <div class="hero-copy">
      <p class="eyebrow">Flight Booking</p>
      <h1>更顺手的航班浏览、预订与订单管理体验</h1>
      <p class="hero-text">
        这是一版基于现有 Java 接口重构的 Vue 前端。先聚焦用户端主流程，把老旧 JSP 页面替换成更一致、清爽、可继续扩展的现代界面。
      </p>
      <div class="hero-actions">
        <button class="primary-btn" @click="router.push('/flights')">立即查看航班</button>
        <button class="ghost-btn hero-secondary" @click="router.push('/news')">浏览新闻公告</button>
      </div>
      <div class="hero-stats">
        <div class="stat-card">
          <strong>{{ flights.length }}</strong>
          <span>首页展示航班</span>
        </div>
        <div class="stat-card">
          <strong>{{ newsList.length }}</strong>
          <span>最新新闻动态</span>
        </div>
        <div class="stat-card">
          <strong>Vue 3</strong>
          <span>工程化重构中</span>
        </div>
      </div>
    </div>
    <div class="banner-list banner-list--enhanced">
      <img v-for="(item, index) in appStore.banners.slice(0, 2)" :key="index" :src="item" class="banner-image" />
      <div v-if="!appStore.banners.length" class="banner-image banner-fallback">轮播图加载后会展示在这里</div>
    </div>
  </section>

  <section class="section-block">
    <div class="section-head">
      <div>
        <p class="section-kicker">POPULAR FLIGHTS</p>
        <h2>热门航班推荐</h2>
      </div>
      <button class="text-btn" @click="router.push('/flights')">查看全部</button>
    </div>
    <div class="flight-grid">
      <article v-for="item in flights" :key="item.id" class="flight-card flight-card--rich" @click="router.push(`/flights/${item.id}`)">
        <img v-if="pickFirstImage(item.feijiPhoto)" :src="pickFirstImage(item.feijiPhoto)" class="flight-card__image" />
        <div v-else class="flight-card__image flight-card__placeholder">暂无图片</div>
        <div class="flight-card__body">
          <div class="card-topline">
            <span class="chip">{{ item.feijiValue || '航班' }}</span>
            <strong>{{ formatPrice(item.feijiNewMoney) }}</strong>
          </div>
          <h3>{{ item.feijiName }}</h3>
          <p>{{ item.feijiStartAddress }} → {{ item.feijiEndAddress }}</p>
          <p class="muted">{{ item.feijiStartTime || '起飞时间待定' }}</p>
        </div>
      </article>
    </div>
  </section>

  <section class="section-block">
    <div class="section-head">
      <div>
        <p class="section-kicker">NEWS</p>
        <h2>最新新闻公告</h2>
      </div>
      <button class="text-btn" @click="router.push('/news')">更多</button>
    </div>
    <div class="news-list news-list--cards">
      <article v-for="item in newsList" :key="item.id" class="news-item news-item--hover" @click="router.push(`/news/${item.id}`)">
        <span class="chip chip--soft">公告</span>
        <h3>{{ item.newsName }}</h3>
        <p class="news-text">{{ item.newsContent?.replace(/<[^>]+>/g, '').slice(0, 100) || '暂无内容' }}</p>
      </article>
    </div>
  </section>
</template>
