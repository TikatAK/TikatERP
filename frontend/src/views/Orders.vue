<template>
  <div class="orders-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
          <el-button type="primary" @click="showDialog = true">新建订单</el-button>
        </div>
      </template>

      <el-table :data="orders" border stripe>
        <el-table-column prop="order_no" label="订单号" width="150" />
        <el-table-column prop="customer_name" label="客户" width="180" />
        <el-table-column prop="material_name" label="物料" width="150" />
        <el-table-column prop="color_code" label="颜色" width="120" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="delivery_date" label="交期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showDialog" title="新建订单" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="订单号">
          <el-input v-model="form.orderNo" />
        </el-form-item>
        <el-form-item label="客户">
          <el-select v-model="form.customerId" style="width: 100%">
            <el-option
              v-for="customer in customers"
              :key="customer.id"
              :label="customer.customer_name"
              :value="customer.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料">
          <el-select v-model="form.materialId" style="width: 100%">
            <el-option
              v-for="material in materials"
              :key="material.id"
              :label="material.material_name"
              :value="material.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="颜色">
          <el-input v-model="form.colorCode" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="form.quantity" :min="0" />
        </el-form-item>
        <el-form-item label="交期">
          <el-date-picker v-model="form.deliveryDate" type="date" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const orders = ref([])
const customers = ref([])
const materials = ref([])
const showDialog = ref(false)
const form = ref({
  orderNo: '',
  customerId: null,
  materialId: null,
  colorCode: '',
  quantity: 0,
  deliveryDate: ''
})

const fetchOrders = async () => {
  orders.value = await request.get('/orders')
}

const fetchCustomers = async () => {
  customers.value = await request.get('/customers')
}

const fetchMaterials = async () => {
  materials.value = await request.get('/materials')
}

const handleCreate = async () => {
  try {
    await request.post('/orders', form.value)
    ElMessage.success('创建成功')
    showDialog.value = false
    fetchOrders()
  } catch (error) {
    console.error(error)
  }
}

const viewDetail = (row: any) => {
  ElMessage.info('查看订单详情: ' + row.order_no)
}

const getStatusType = (status: string) => {
  const map: any = { pending: 'warning', processing: 'primary', completed: 'success' }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: any = { pending: '待处理', processing: '进行中', completed: '已完成' }
  return map[status] || status
}

onMounted(() => {
  fetchOrders()
  fetchCustomers()
  fetchMaterials()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
