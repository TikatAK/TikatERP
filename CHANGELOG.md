# 版本变更记录

## 版本 2.0 (2026-01-23)

### 主要变更

#### 1. 依赖包更新
- **bcrypt → bcryptjs**: 将密码加密库从 `bcrypt` 更换为 `bcryptjs`
  - 文件: `backend/package.json`, `backend/src/auth/auth.service.ts`
  - 原因: bcryptjs 是纯 JavaScript 实现，无需编译，更易于跨平台部署

#### 2. 数据库架构完善
- **新增多个业务表**: 完善了数据库表结构 (`database/init.sql`)
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

#### 3. 业务逻辑优化
- **配方查询优化** (`backend/src/recipes/recipes.service.ts`)
  - 移除了 `WHERE r.status = 'active'` 条件
  - 现在可以查询所有配方，包括非活动状态的配方

- **排产字段重命名** (`backend/src/schedule/schedule.service.ts`)
  - `scheduled_start` → `start_time`
  - `scheduled_end` → `end_time`
  - 移除了 `route_id` 字段
  - 优先级默认值从 0 改为 5
  - 排序字段更新: `ORDER BY j.priority DESC, j.start_time ASC`

#### 4. 启动脚本增强
- **Docker 启动脚本改进** (`start.bat`)
  - 添加了错误处理逻辑
  - 当 docker-compose down 失败时显示警告但继续执行
  - 当 docker-compose up 失败时显示详细错误信息并退出

#### 5. 文档本地化
- **文档重命名为中文**
  - `DELIVERY.md` → `交付文档.md`
  - `FIX_REPORT.md` → `修复报告.md`
  - `INSPECTION_REPORT.md` → `检查报告.md`
  - `PROJECT_SUMMARY.md` → `项目概要.md`

#### 6. 新增文件
- `create-admin.js` - 管理员账户创建脚本
- `start-local.bat` - 本地开发启动脚本
- `backend/package-lock.json` - 后端依赖锁定文件
- `frontend/package-lock.json` - 前端依赖锁定文件

### 技术改进
- 提升了跨平台兼容性（bcryptjs）
- 完善了数据库表结构，支持完整业务流程
- 优化了字段命名，更符合业务语义
- 增强了启动脚本的健壮性

### 注意事项
⚠️ **数据库迁移**: 如果从 1.0 版本升级，需要执行数据库迁移脚本更新表结构
⚠️ **依赖更新**: 需要重新运行 `npm install` 安装新的依赖包
