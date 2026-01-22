# 印染ERP系统 v2.1

一个完整的印染制造企业ERP系统，覆盖从订单接收到成本核算的核心流程。

## 📋 版本信息

- **当前版本**: 2.1
- **发布日期**: 2026-01-23
- **Node.js版本**: 24.x
- **数据库**: PostgreSQL 15

## 🚀 快速开始

### 前置要求

- Docker Desktop (推荐)
- Node.js 24+ (本地开发)
- PostgreSQL 15+ (可选，Docker已包含)

### 方式一：完全Docker部署（推荐生产环境）

```bash
# 1. 克隆项目
git clone https://github.com/TikatAK/TikatERP.git
cd TikatERP

# 2. 启动所有服务
start.bat
# 或使用命令行
docker-compose up -d

# 3. 访问系统
# 前端: http://localhost:5173
# 后端: http://localhost:3000
```

### 方式二：本地开发模式（推荐开发测试）

```bash
# 1. 启动服务
start-local.bat

# 2. 系统会自动：
#    - 启动PostgreSQL数据库（Docker）
#    - 启动后端开发服务器（Node.js）
#    - 启动前端开发服务器（Node.js）
```

### 默认账号

- **用户名**: admin
- **密码**: admin123

## 🏗️ 技术栈

### 后端
- **框架**: NestJS (TypeScript)
- **数据库**: PostgreSQL 15
- **认证**: JWT + Passport
- **密码加密**: bcryptjs
- **ORM**: 原生SQL查询

### 前端
- **框架**: Vue 3 (Composition API + TypeScript)
- **状态管理**: Pinia
- **UI组件**: Element Plus
- **图表**: ECharts
- **HTTP客户端**: Axios
- **构建工具**: Vite

### 部署
- **容器化**: Docker + Docker Compose
- **Node版本**: 24-alpine
- **数据持久化**: Docker Volumes

## 📦 核心功能

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

## 📂 项目结构

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
│   │   └── dashboard/      # 仪表盘模块
│   ├── package.json
│   └── Dockerfile
├── frontend/               # Vue 3前端
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── stores/        # Pinia状态管理
│   │   └── router/        # 路由配置
│   ├── package.json
│   └── Dockerfile
├── database/              # 数据库脚本
│   └── init.sql          # 初始化SQL
├── docker-compose.yml    # Docker编排
├── start.bat            # Docker启动脚本
├── start-local.bat      # 本地开发启动脚本
├── CHANGELOG.md         # 版本变更记录
└── README.md           # 项目文档
```

## 🔧 常用命令

### Docker模式

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down

# 重新构建镜像
docker-compose build

# 重启服务
docker-compose restart
```

### 本地开发模式

```bash
# 后端开发
cd backend
npm install
npm run start:dev

# 前端开发
cd frontend
npm install
npm run dev

# 数据库（Docker）
docker-compose up -d postgres
```

## 🔄 关机后重启步骤

### Docker模式
1. 确保 Docker Desktop 正在运行
2. 双击 `start.bat` 或运行 `docker-compose up -d`
3. 访问 http://localhost:5173

### 本地开发模式
1. 确保 Docker Desktop 正在运行
2. 双击 `start-local.bat`
3. 访问 http://localhost:5173

**数据不会丢失** - 数据库数据存储在Docker volume中，会自动保留！

## ⚙️ Docker镜像源配置（中国大陆用户）

如果遇到Docker镜像下载失败，请配置国内镜像源：

1. 打开 Docker Desktop → Settings → Docker Engine
2. 添加以下配置：

```json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live",
    "https://hub.rat.dev"
  ]
}
```

3. 点击 "Apply & Restart"

详细配置说明请查看：`docker-镜像源配置说明.md`

## 🗄️ 数据库表结构

### 核心表
- `users` - 用户表
- `roles` - 角色表
- `permissions` - 权限表
- `user_roles` - 用户角色关联
- `role_permissions` - 角色权限关联

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

## 🔐 安全特性

- 所有API接口验证JWT令牌
- 密码使用bcryptjs加密存储
- 功能权限验证（菜单+按钮级）
- 数据权限自动过滤（行级安全）
- 敏感操作记录审计日志
- CORS跨域配置
- SQL注入防护（参数化查询）

## 🆕 版本更新

### v2.1 (2026-01-23)
- ✅ 统一Node.js版本为24.x
- ✅ 优化前端Docker构建（生产模式）
- ✅ 配置国内Docker镜像源
- ✅ 修复本地开发与Docker部署的环境差异

### v2.0 (2026-01-23)
- ✅ 更换为bcryptjs密码加密库
- ✅ 完善数据库表结构（新增10个业务表）
- ✅ 优化排产字段命名
- ✅ 增强启动脚本错误处理
- ✅ 文档本地化

详细变更请查看：[CHANGELOG.md](CHANGELOG.md)

## ❓ 常见问题

### 1. Docker启动失败
```bash
# 检查Docker Desktop是否运行
# 检查端口占用
netstat -ano | findstr "5432 3000 5173"

# 重新启动
docker-compose down
docker-compose up -d
```

### 2. 数据库连接失败
- 检查 `.env` 文件配置
- 确认PostgreSQL服务已启动
- 验证数据库凭据

### 3. 前端无法访问后端
- 检查后端服务是否运行在 http://localhost:3000
- 查看浏览器控制台错误信息
- 确认CORS配置正确

### 4. Docker镜像下载失败
- 配置国内镜像源（见上方配置说明）
- 检查网络连接
- 尝试使用VPN

## 📝 开发注意事项

### 本地开发 vs Docker部署差异

为避免环境差异问题，请注意：

1. **Node.js版本**: 统一使用24.x
2. **环境变量**: 确保在docker-compose.yml中定义
3. **文件路径**: 使用相对路径，避免绝对路径
4. **大小写敏感**: Linux区分大小写，Windows不区分

## 📄 许可证

MIT License

## 📧 联系方式

如有问题或建议，请提交Issue或Pull Request。

---

**注意**: 这是一个MVP版本，用于演示核心功能。生产环境部署前请：
1. 修改所有默认密码和密钥
2. 配置HTTPS
3. 设置防火墙规则
4. 启用数据库备份
5. 配置日志监控
6. 进行安全审计
