import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const permissions = ref<string[]>([])

  const login = async (username: string, password: string) => {
    const res: any = await request.post('/auth/login', { username, password })
    token.value = res.access_token
    user.value = res.user
    localStorage.setItem('token', res.access_token)
    localStorage.setItem('user', JSON.stringify(res.user))
    await fetchPermissions()
    return res
  }

  const logout = () => {
    token.value = ''
    user.value = null
    permissions.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const fetchPermissions = async () => {
    const res: any = await request.get('/users/me/permissions')
    permissions.value = res.map((p: any) => p.permission_code)
  }

  const hasPermission = (permissionCode: string) => {
    return permissions.value.includes(permissionCode)
  }

  return {
    token,
    user,
    permissions,
    login,
    logout,
    fetchPermissions,
    hasPermission
  }
})
