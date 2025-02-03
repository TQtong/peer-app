import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/home',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: '/room',
          name: 'room',
          component: () => import('../views/RoomView.vue'),
        },
      ]
    },
  ],
})

export default router
