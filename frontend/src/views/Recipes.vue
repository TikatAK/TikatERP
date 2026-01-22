<template>
  <div class="recipes-page">
    <el-card>
      <template #header>
        <span>配方管理</span>
      </template>

      <el-table :data="recipes" border stripe>
        <el-table-column prop="recipe_code" label="配方编号" width="150" />
        <el-table-column prop="recipe_name" label="配方名称" width="200" />
        <el-table-column prop="material_name" label="物料" width="150" />
        <el-table-column prop="color_code" label="颜色" width="120" />
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showDialog" title="配方详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="配方编号">{{ detail.recipe_code }}</el-descriptions-item>
        <el-descriptions-item label="配方名称">{{ detail.recipe_name }}</el-descriptions-item>
        <el-descriptions-item label="物料">{{ detail.material_name }}</el-descriptions-item>
        <el-descriptions-item label="颜色">{{ detail.color_code }}</el-descriptions-item>
      </el-descriptions>

      <h4 style="margin-top: 20px">配方明细</h4>
      <el-table :data="detail.items" border>
        <el-table-column prop="dye_name" label="染化料" />
        <el-table-column prop="quantity" label="用量" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="percentage" label="百分比" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const recipes = ref([])
const showDialog = ref(false)
const detail = ref<any>({ items: [] })

const fetchRecipes = async () => {
  recipes.value = await request.get('/recipes')
}

const viewDetail = async (row: any) => {
  detail.value = await request.get(`/recipes/${row.id}`)
  showDialog.value = true
}

onMounted(() => {
  fetchRecipes()
})
</script>
