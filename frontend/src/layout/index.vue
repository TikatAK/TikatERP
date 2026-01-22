<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="logo">印染ERP</div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/schedule">
          <el-icon><Calendar /></el-icon>
          <span>排产管理</span>
        </el-menu-item>
        <el-menu-item index="/production">
          <el-icon><Setting /></el-icon>
          <span>生产执行</span>
        </el-menu-item>
        <el-menu-item index="/recipes">
          <el-icon><List /></el-icon>
          <span>配方管理</span>
        </el-menu-item>
        <el-menu-item index="/cost">
          <el-icon><Money /></el-icon>
          <span>成本核算</span>
        </el-menu-item>
        <el-menu-item index="/users" v-if="hasPermission('manage_users')">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/roles" v-if="hasPermission('manage_roles')">
          <el-icon><Lock /></el-icon>
          <span>角色权限</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-content">
          <span>欢迎，{{ authStore.user?.realName || authStore.user?.username }}</span>
          <el-button @click="handleLogout" type="danger" size="small">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

const hasPermission = (code: string) => {
  return authStore.hasPermission(code)
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: #2b3a4a;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
