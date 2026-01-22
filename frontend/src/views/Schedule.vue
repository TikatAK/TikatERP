<template>
  <div class="schedule-page">
    <el-card>
      <template #header>
        <span>排产管理</span>
      </template>

      <el-table :data="jobs" border stripe>
        <el-table-column prop="job_no" label="缸号" width="120" />
        <el-table-column prop="order_no" label="订单号" width="150" />
        <el-table-column prop="material_name" label="物料" width="150" />
        <el-table-column prop="workshop" label="车间" width="100" />
        <el-table-column prop="machine_no" label="机台" width="100" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="priority" label="优先级" width="80" />
        <el-table-column prop="scheduled_start" label="计划开始" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">调整</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showDialog" title="调整排产" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="机台">
          <el-input v-model="editForm.machineNo" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="editForm.priority" :min="0" :max="10" />
        </el-form-item>
        <el-form-item label="计划开始">
          <el-date-picker
            v-model="editForm.scheduledStart"
            type="datetime"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="计划结束">
          <el-date-picker
            v-model="editForm.scheduledEnd"
            type="datetime"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const jobs = ref([])
const showDialog = ref(false)
const currentJobId = ref(0)
const editForm = ref({
  machineNo: '',
  priority: 0,
  scheduledStart: '',
  scheduledEnd: ''
})

const fetchJobs = async () => {
  jobs.value = await request.get('/schedule')
}

const handleEdit = (row: any) => {
  currentJobId.value = row.id
  editForm.value = {
    machineNo: row.machine_no,
    priority: row.priority,
    scheduledStart: row.scheduled_start,
    scheduledEnd: row.scheduled_end
  }
  showDialog.value = true
}

const handleUpdate = async () => {
  try {
    await request.put(`/schedule/${currentJobId.value}/reassign`, editForm.value)
    ElMessage.success('调整成功')
    showDialog.value = false
    fetchJobs()
  } catch (error) {
    console.error(error)
  }
}

const getStatusType = (status: string) => {
  const map: any = { pending: 'info', processing: 'primary', completed: 'success' }
  return map[status] || 'info'
}

onMounted(() => {
  fetchJobs()
})
</script>
