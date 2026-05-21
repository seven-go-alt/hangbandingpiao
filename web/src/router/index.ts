import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import FlightListView from '@/views/flight/FlightListView.vue'
import FlightDetailView from '@/views/flight/FlightDetailView.vue'
import NewsListView from '@/views/news/NewsListView.vue'
import NewsDetailView from '@/views/news/NewsDetailView.vue'
import OrderListView from '@/views/order/OrderListView.vue'
import OrderCreateView from '@/views/order/OrderCreateView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import RechargeView from '@/views/profile/RechargeView.vue'
import CollectionListView from '@/views/collection/CollectionListView.vue'
import MessageListView from '@/views/message/MessageListView.vue'
import FrontLayout from '@/layouts/FrontLayout.vue'
import { getStorage, TOKEN_KEY } from '@/utils/storage'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: FrontLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'flights', name: 'flights', component: FlightListView },
        { path: 'flights/:id', name: 'flight-detail', component: FlightDetailView, props: true },
        { path: 'news', name: 'news', component: NewsListView },
        { path: 'news/:id', name: 'news-detail', component: NewsDetailView, props: true },
        { path: 'orders', name: 'orders', component: OrderListView, meta: { requiresAuth: true } },
        { path: 'collections', name: 'collections', component: CollectionListView, meta: { requiresAuth: true } },
        { path: 'messages', name: 'messages', component: MessageListView, meta: { requiresAuth: true } },
        { path: 'orders/create/:flightId', name: 'order-create', component: OrderCreateView, props: true, meta: { requiresAuth: true } },
        { path: 'profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
        { path: 'recharge', name: 'recharge', component: RechargeView, meta: { requiresAuth: true } },
      ],
    },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const token = getStorage(TOKEN_KEY)
  if (to.meta.requiresAuth && !token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
