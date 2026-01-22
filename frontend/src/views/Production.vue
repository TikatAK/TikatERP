<template>
  <div class="production-page">
    <el-card>
      <template #header>
        <span>生产执行</span>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="报工" name="report">
          <el-form :model="reportForm" label-width="100px">
            <el-form-item label="缸号">
              <el-input v-model="reportForm.jobNo" placeholder="扫码或输入缸号" />
            </el-form-item>
            <el-form-item label="工序">
              <el-select v-model="reportForm.stepId" style="width: 100%">
                <el-option label="染色" :value="1" />
                <el-option label="水洗" :value="2" />
                <el-option label="定型" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="数量">
              <el-input-number v-model="reportForm.quantity" :min="0" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="reportForm.remarks" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleReport">提交报工</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="异常上报" name="issue">
          <el-form :model="issueForm" label-width="100px">
            <el-form-item label="缸号">
              <el-input v-model="issueForm.jobNo" />
            </el-form-item>
            <el-form-item label="问题类型">
              <el-select v-model="issueForm.issueType" style="width: 100%">
                <el-option label="色差" value="color_difference" />
                <el-option label="断布" value="fabric_break" />
                <el-option label="设备故障" value="equipment_failure" />
              </el-select>
            </el-form-item>
            <el-form-item label="严重程度">
              <el-select v-model="issueForm.severity" style="width: 100%">
                <el-option label="低" value="low" />
                <el-option label="中" value="medium" />
                <el-option label="高" value="high" />
              </el-select>
            </el-form-item>
            <el-form-item label="问题描述">
              <el-input v-model="issueForm.description" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="handleIssue">提交异常</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const activeTab = ref('report')
const reportForm = ref({
  jobNo: '',
  stepId: null,
  quantity: 0,
  remarks: ''
})

const issueForm = ref({
  jobNo: '',
  issueType: '',
  severity: '',
  description: ''
})

const handleReport = async () => {
  try {
    await request.post('/production/work/report', {
      jobId: 1,
      stepId: reportForm.value.stepId,
      quantity: reportForm.value.quantity,
      remarks: reportForm.value.remarks
    })
    ElMessage.success('报工成功')
  } catch (error) {
    console.error(error)
  }
}

const handleIssue = async () => {
  try {
    await request.post('/production/issues', {
      jobId: 1,
      issueType: issueForm.value.issueType,
      severity: issueForm.value.severity,
      description: issueForm.value.description
    })
    ElMessage.success('异常上报成功')
  } catch (error) {
    console.error(error)
  }
}
</script>
