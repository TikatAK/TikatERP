<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="kpi-card">
          <div class="kpi-content">
            <el-icon class="kpi-icon" color="#409EFF"><Document /></el-icon>
            <div>
              <div class="kpi-value">{{ kpis.totalOrders }}</div>
              <div class="kpi-label">总订单数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card">
          <div class="kpi-content">
            <el-icon class="kpi-icon" color="#67C23A"><Clock /></el-icon>
            <div>
              <div class="kpi-value">{{ kpis.pendingJobs }}</div>
              <div class="kpi-label">进行中任务</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card">
          <div class="kpi-content">
            <el-icon class="kpi-icon" color="#E6A23C"><SuccessFilled /></el-icon>
            <div>
              <div class="kpi-value">{{ kpis.completedJobs }}</div>
              <div class="kpi-label">已完成任务</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card">
          <div class="kpi-content">
            <el-icon class="kpi-icon" color="#F56C6C"><Warning /></el-icon>
            <div>
              <div class="kpi-value">{{ kpis.qualityIssues }}</div>
              <div class="kpi-label">质量问题</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>车间负荷</span>
          </template>
          <div ref="workshopChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>生产趋势</span>
          </template>
          <div ref="trendChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'

const kpis = ref({
  totalOrders: 0,
  pendingJobs: 0,
  completedJobs: 0,
  qualityIssues: 0
})

const workshopChart = ref()
const trendChart = ref()

const fetchKPIs = async () => {
  const res: any = await request.get('/dashboard/kpis')
  kpis.value = res
}

const initWorkshopChart = async () => {
  const res: any = await request.get('/dashboard/workshop-load')
  const chart = echarts.init(workshopChart.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: res.map((item: any) => item.workshop) },
    yAxis: { type: 'value' },
    series: [{ data: res.map((item: any) => item.job_count), type: 'bar' }]
  })
}

const initTrendChart = async () => {
  const res: any = await request.get('/dashboard/production-trend')
  const chart = echarts.init(trendChart.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: res.map((item: any) => item.date) },
    yAxis: { type: 'value' },
    series: [{ data: res.map((item: any) => item.count), type: 'line', smooth: true }]
  })
}

onMounted(() => {
  fetchKPIs()
  initWorkshopChart()
  initTrendChart()
})
</script>

<style scoped>
.kpi-card {
  cursor: pointer;
  transition: all 0.3s;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.kpi-icon {
  font-size: 48px;
}

.kpi-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
}

.kpi-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}
</style>
