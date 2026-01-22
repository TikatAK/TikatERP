<template>
  <div class="roles-page">
    <el-card>
      <template #header>
        <span>角色权限管理</span>
      </template>

      <el-table :data="roles" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="role_code" label="角色编码" width="150" />
        <el-table-column prop="role_name" label="角色名称" width="150" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="viewPermissions(row)">查看权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showDialog" title="角色权限" width="600px">
      <el-table :data="rolePermissions" border>
        <el-table-column prop="permission_name" label="权限名称" />
        <el-table-column prop="resource" label="资源" />
        <el-table-column prop="action" label="操作" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const roles = ref([])
const showDialog = ref(false)
const rolePermissions = ref([])

const fetchRoles = async () => {
  roles.value = await request.get('/roles')
}

const viewPermissions = async (row: any) => {
  rolePermissions.value = await request.get(`/roles/${row.id}/permissions`)
  showDialog.value = true
}

onMounted(() => {
  fetchRoles()
})
</script>
