<template>
  <div class="cost-page">
    <el-card>
      <template #header>
        <span>成本核算</span>
      </template>

      <el-form :model="queryForm" inline>
        <el-form-item label="缸号">
          <el-input v-model="queryForm.jobId" placeholder="输入缸号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchCost">查询</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div v-if="costData.jobId">
        <h3>缸号: {{ costData.jobId }}</h3>
        <el-descriptions :column="2" border style="margin-top: 20px">
          <el-descriptions-item label="染料成本">
            ¥{{ costData.breakdown?.dye_cost || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="水电汽成本">
            ¥{{ costData.breakdown?.energy_cost || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="人工成本">
            ¥{{ costData.breakdown?.labor_cost || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="折旧成本">
            ¥{{ costData.breakdown?.depreciation_cost || 0 }}
          </el-descriptions-item>
        </el-descriptions>

        <el-statistic
          title="总成本"
          :value="costData.totalCost"
          prefix="¥"
          style="margin-top: 30px"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const queryForm = ref({ jobId: '' })
const costData = ref<any>({ breakdown: {} })

const fetchCost = async () => {
  if (!queryForm.value.jobId) {
    ElMessage.warning('请输入缸号')
    return
  }
  try {
    costData.value = await request.get(`/cost/job/${queryForm.value.jobId}`)
  } catch (error) {
    console.error(error)
  }
}
</script>
