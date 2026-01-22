# 印染ERP系统 - MVP版本

一个完整的印染制造企业ERP系统，覆盖从订单接收到成本核算的核心流程。

## 技术栈

### 后端
- NestJS (TypeScript)
- PostgreSQL 15
- JWT认证
- bcrypt密码加密

### 前端
- Vue 3 (TypeScript)
- Pinia状态管理
- Element Plus UI组件库
- ECharts图表
- Axios HTTP客户端

### 部署
- Docker & Docker Compose
- 支持本地或云部署

## 核心功能

### 1. 用户与权限管理
- JWT身份认证
- 基于角色的访问控制(RBAC)
- 功能权限（菜单+按钮级）
- 数据权限（行级过滤）
- 用户-角色多对多绑定

### 2. 主数据管理
- 客户管理（客户代码、联系人、默认工艺）
- 物料管理（坯布/成品、克重、幅宽、色号）
- 染化料库（批次、保质期、安全库存）
- 工艺路线模板

### 3. 订单与排产
- 销售订单录入
- 自动生成生产任务（缸号）
- 智能排产引擎
- 可视化排产管理

### 4. 生产执行(MES)
- 扫码报工
- 异常上报（色差、断布、停机）
- 在制品(WIP)追踪

### 5. 配方与物料扣减
- 标准配方库
- 自动扣减染化料库存
- 实际用量vs理论用量偏差分析

### 6. 成本核算
- 自动归集每缸布成本（染料+水电汽+人工+折旧）
- 订单毛利报表
- 工序能耗排名

### 7. Dashboard仪表盘
- KPI卡片（订单数、任务数、质量问题）
- 车间负荷图表
- 生产趋势分析
- 动态权限渲染

## 快速开始

### 前置要求
- Docker & Docker Compose
- Node.js 18+ (本地开发)
- PostgreSQL 15+ (本地开发)

### 一键启动（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd ERP

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

服务启动后访问：
- 前端: http://localhost:5173
- 后端API: http://localhost:3000

### 默认账号
- 用户名: `admin`
- 密码: `admin123`

## 本地开发

### 后端开发

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 启动开发服务器
npm run start:dev
```

### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 数据库初始化

```bash
# 使用Docker启动PostgreSQL
docker-compose up -d postgres

# 数据库会自动执行 database/init.sql 初始化脚本
```

## 项目结构

```
ERP/
├── backend/                 # NestJS后端
│   ├── src/
│   │   ├── auth/           # 认证模块
│   │   ├── users/          # 用户模块
│   │   ├── roles/          # 角色权限模块
│   │   ├── orders/         # 订单模块
│   │   ├── schedule/       # 排产模块
│   │   ├── production/     # 生产执行模块
│   │   ├── recipes/        # 配方管理模块
│   │   ├── cost/           # 成本核算模块
│   │   ├── dashboard/      # 仪表盘模块
│   │   └── database/       # 数据库连接
│   ├── package.json
│   └── Dockerfile
├── frontend/               # Vue 3前端
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── layout/        # 布局组件
│   │   ├── stores/        # Pinia状态管理
│   │   ├── router/        # 路由配置
│   │   └── utils/         # 工具函数
│   ├── package.json
│   └── Dockerfile
├── database/              # 数据库脚本
│   └── init.sql          # 初始化SQL
├── docker-compose.yml    # Docker编排
└── README.md            # 项目文档
```

## API接口示例

### 认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 订单管理
- `GET /api/orders` - 获取订单列表
- `POST /api/orders` - 创建订单
- `GET /api/orders/:id` - 获取订单详情

### 排产管理
- `GET /api/schedule` - 获取排产列表
- `POST /api/schedule` - 创建生产任务
- `PUT /api/schedule/:id/reassign` - 调整排产

### 生产执行
- `GET /api/production/jobs` - 获取生产任务
- `POST /api/production/work/report` - 报工
- `POST /api/production/issues` - 异常上报

### 成本核算
- `GET /api/cost/job/:id` - 获取缸号成本
- `POST /api/cost/record` - 记录成本
- `GET /api/cost/order/:id/profit` - 获取订单毛利

### Dashboard
- `GET /api/dashboard/kpis` - 获取KPI指标
- `GET /api/dashboard/production-trend` - 生产趋势
- `GET /api/dashboard/workshop-load` - 车间负荷

## 数据库表结构

### 核心表
- `users` - 用户表
- `roles` - 角色表
- `permissions` - 权限表
- `user_roles` - 用户角色关联
- `role_permissions` - 角色权限关联
- `data_permissions` - 数据权限表

### 业务表
- `customers` - 客户表
- `materials` - 物料表
- `dyes` - 染化料表
- `sales_orders` - 销售订单表
- `production_jobs` - 生产任务表（缸号）
- `process_steps` - 工序步骤表
- `recipes` - 配方表
- `recipe_items` - 配方明细表
- `work_reports` - 报工记录表
- `quality_issues` - 质量问题表
- `cost_records` - 成本记录表
- `energy_logs` - 能耗日志表
- `audit_logs` - 审计日志表

## 安全特性

- 所有API接口验证JWT令牌
- 密码使用bcrypt加密存储
- 功能权限验证（菜单+按钮级）
- 数据权限自动过滤（行级安全）
- 敏感操作记录审计日志
- CORS跨域配置
- SQL注入防护（参数化查询）

## 演示流程

### 完整业务流程演示

1. **登录系统**
   - 使用 admin/admin123 登录
   - 系统自动加载用户权限

2. **创建订单**
   - 进入"订单管理"
   - 点击"新建订单"
   - 选择客户、物料、颜色、数量、交期
   - 提交订单

3. **排产管理**
   - 进入"排产管理"
   - 系统自动生成生产任务（缸号）
   - 分配车间、机台、优先级
   - 设置计划开始/结束时间

4. **生产报工**
   - 进入"生产执行"
   - 扫码或输入缸号
   - 选择工序（染色/水洗/定型）
   - 输入完成数量
   - 提交报工

5. **异常上报**
   - 在"生产执行"页面
   - 切换到"异常上报"标签
   - 选择问题类型（色差/断布/设备故障）
   - 填写描述和严重程度
   - 提交异常

6. **成本核算**
   - 进入"成本核算"
   - 输入缸号查询
   - 查看成本明细（染料+水电汽+人工+折旧）
   - 分析成本构成

7. **Dashboard分析**
   - 查看KPI指标卡片
   - 分析车间负荷图表
   - 查看生产趋势
   - 识别质量问题

## 常见问题

### 1. Docker启动失败
```bash
# 检查端口占用
netstat -ano | findstr "5432"
netstat -ano | findstr "3000"
netstat -ano | findstr "5173"

# 停止并重新启动
docker-compose down
docker-compose up -d
```

### 2. 数据库连接失败
- 检查 `.env` 文件配置
- 确认PostgreSQL服务已启动
- 验证数据库凭据

### 3. 前端无法访问后端
- 检查 `frontend/.env` 中的 `VITE_API_URL`
- 确认后端服务运行在 http://localhost:3000
- 查看浏览器控制台错误信息

## 技术亮点

1. **权限系统**
   - RBAC + 行级数据权限
   - 动态菜单渲染
   - 按钮级权限控制

2. **实时性**
   - 扫码报工即时更新
   - 库存自动扣减
   - 成本实时归集

3. **数据一致性**
   - 事务保证
   - 乐观锁控制
   - 审计日志追踪

4. **可扩展性**
   - 模块化设计
   - RESTful API
   - Docker容器化

## 后续优化方向

- [ ] 添加单元测试和集成测试
- [ ] 实现WebSocket实时推送
- [ ] 增加文件上传功能（质量问题图片）
- [ ] 优化排产算法（考虑机台负荷、工艺匹配）
- [ ] 添加报表导出功能（Excel/PDF）
- [ ] 实现移动端适配
- [ ] 增加数据备份和恢复功能
- [ ] 性能优化（缓存、索引优化）
- [ ] 国际化支持

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交Issue或Pull Request。

---

**注意**: 这是一个MVP版本，用于演示核心功能。生产环境部署前请：
1. 修改所有默认密码和密钥
2. 配置HTTPS
3. 设置防火墙规则
4. 启用数据库备份
5. 配置日志监控
6. 进行安全审计
