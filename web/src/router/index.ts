import { createRouter, createWebHistory } from 'vue-router'
import FrontLayout from '@/layouts/FrontLayout.vue'
import { getStorage, TOKEN_KEY } from '@/utils/storage'

const HomeView = () => import('@/views/home/HomeView.vue')
const LoginView = () => import('@/views/auth/LoginView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const FlightListView = () => import('@/views/flight/FlightListView.vue')
const FlightDetailView = () => import('@/views/flight/FlightDetailView.vue')
const NewsListView = () => import('@/views/news/NewsListView.vue')
const NewsDetailView = () => import('@/views/news/NewsDetailView.vue')
const OrderListView = () => import('@/views/order/OrderListView.vue')
const OrderDetailView = () => import('@/views/order/OrderDetailView.vue')
const OrderCreateView = () => import('@/views/order/OrderCreateView.vue')
const ProfileView = () => import('@/views/profile/ProfileView.vue')
const RechargeView = () => import('@/views/profile/RechargeView.vue')
const CollectionListView = () => import('@/views/collection/CollectionListView.vue')
const MessageListView = () => import('@/views/message/MessageListView.vue')

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
        { path: 'orders/:id', name: 'order-detail', component: OrderDetailView, props: true, meta: { requiresAuth: true } },
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
