import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Layout from '@/layout/index.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Orders from '@/views/Orders.vue'
import Schedule from '@/views/Schedule.vue'
import Production from '@/views/Production.vue'
import Recipes from '@/views/Recipes.vue'
import Cost from '@/views/Cost.vue'
import Users from '@/views/Users.vue'
import Roles from '@/views/Roles.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        { path: 'dashboard', name: 'Dashboard', component: Dashboard },
        { path: 'orders', name: 'Orders', component: Orders },
        { path: 'schedule', name: 'Schedule', component: Schedule },
        { path: 'production', name: 'Production', component: Production },
        { path: 'recipes', name: 'Recipes', component: Recipes },
        { path: 'cost', name: 'Cost', component: Cost },
        { path: 'users', name: 'Users', component: Users },
        { path: 'roles', name: 'Roles', component: Roles }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.path !== '/login' && !authStore.token) {
    next('/login')
  } else if (to.path === '/login' && authStore.token) {
    next('/')
  } else {
    next()
  }
})

export default router
