import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/valentine-lottery'
    },
    {
      path: '/valentine-lottery',
      name: 'ValentineLottery',
      component: () => import('@/views/ValentineLottery.vue')
    }
  ]
})

export default router 