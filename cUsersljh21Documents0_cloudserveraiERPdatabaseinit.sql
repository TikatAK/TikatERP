
-- 工艺路线模板表
CREATE TABLE process_routes (
    id SERIAL PRIMARY KEY,
    route_code VARCHAR(50) UNIQUE NOT NULL,
    route_name VARCHAR(200) NOT NULL,
    description TEXT,
    steps JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 销售订单表
CREATE TABLE sales_orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    material_id INTEGER REFERENCES materials(id),
    color_code VARCHAR(50),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    delivery_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 生产任务表（缸号）
CREATE TABLE production_jobs (
    id SERIAL PRIMARY KEY,
    job_no VARCHAR(50) UNIQUE NOT NULL,
    order_id INTEGER REFERENCES sales_orders(id),
    material_id INTEGER REFERENCES materials(id),
    quantity DECIMAL(10,2) NOT NULL,
    workshop VARCHAR(50),
    machine_no VARCHAR(50),
    route_id INTEGER REFERENCES process_routes(id),
    status VARCHAR(20) DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    scheduled_start TIMESTAMP,
    scheduled_end TIMESTAMP,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 工序步骤表
CREATE TABLE process_steps (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    step_no INTEGER NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    operator_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    remarks TEXT
);

-- 配方表
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    recipe_code VARCHAR(50) UNIQUE NOT NULL,
    recipe_name VARCHAR(200) NOT NULL,
    material_id INTEGER REFERENCES materials(id),
    color_code VARCHAR(50),
    version INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 配方明细表
CREATE TABLE recipe_items (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    dye_id INTEGER REFERENCES dyes(id),
    quantity DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    percentage DECIMAL(5,2)
);

-- 物料消耗记录表
CREATE TABLE material_consumption (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    dye_id INTEGER REFERENCES dyes(id),
    planned_quantity DECIMAL(10,4),
    actual_quantity DECIMAL(10,4),
    variance DECIMAL(10,4),
    consumed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operator_id INTEGER REFERENCES users(id)
);

-- 报工记录表
CREATE TABLE work_reports (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    step_id INTEGER REFERENCES process_steps(id),
    operator_id INTEGER REFERENCES users(id),
    report_type VARCHAR(20) DEFAULT 'complete',
    quantity DECIMAL(10,2),
    remarks TEXT,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 质量问题表
CREATE TABLE quality_issues (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    issue_type VARCHAR(50),
    description TEXT,
    severity VARCHAR(20),
    image_url TEXT,
    reported_by INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 成本记录表
CREATE TABLE cost_records (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    cost_type VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 能耗日志表
CREATE TABLE energy_logs (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    energy_type VARCHAR(20),
    consumption DECIMAL(10,2),
    unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 审计日志表
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    resource VARCHAR(50),
    resource_id INTEGER,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_sales_orders_customer ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_production_jobs_order ON production_jobs(order_id);
CREATE INDEX idx_production_jobs_status ON production_jobs(status);
CREATE INDEX idx_work_reports_job ON work_reports(job_id);
CREATE INDEX idx_cost_records_job ON cost_records(job_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- 插入初始数据
-- 默认管理员用户 (密码: admin123, 已用bcrypt加密)
INSERT INTO users (username, password, real_name, email, status) VALUES
('admin', '$2b$10$YQ7Y8Z8Z8Z8Z8Z8Z8Z8Z8uKX8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', '系统管理员', 'admin@erp.com', 'active');

-- 默认角色
INSERT INTO roles (role_code, role_name, description) VALUES
('admin', '系统管理员', '拥有所有权限'),
('workshop_manager', '车间主任', '管理车间生产'),
('operator', '操作工', '执行生产任务'),
('merchandiser', '跟单员', '管理订单');

-- 默认权限
INSERT INTO permissions (permission_code, permission_name, resource, action) VALUES
('view_dashboard', '查看仪表盘', 'dashboard', 'view'),
('manage_users', '管理用户', 'users', 'manage'),
('manage_roles', '管理角色', 'roles', 'manage'),
('view_orders', '查看订单', 'orders', 'view'),
('edit_orders', '编辑订单', 'orders', 'edit'),
('view_schedule', '查看排产', 'schedule', 'view'),
('edit_schedule', '编辑排产', 'schedule', 'edit'),
('report_work', '报工', 'work', 'report'),
('view_cost', '查看成本', 'cost', 'view'),
('manage_recipes', '管理配方', 'recipes', 'manage');

-- 管理员角色绑定所有权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- 管理员用户绑定管理员角色
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

-- 示例客户数据
INSERT INTO customers (customer_code, customer_name, contact_person, phone) VALUES
('C001', '华联纺织有限公司', '张经理', '13800138001'),
('C002', '东方服装集团', '李总', '13800138002');

-- 示例物料数据
INSERT INTO materials (material_code, material_name, material_type, weight, width) VALUES
('M001', '纯棉坯布', '坯布', 180.00, 150.00),
('M002', '涤棉混纺', '坯布', 200.00, 160.00);

-- 示例染化料数据
INSERT INTO dyes (dye_code, dye_name, category, stock_quantity, unit_price) VALUES
('D001', '活性红3BS', '染料', 500.00, 45.00),
('D002', '活性蓝KN-R', '染料', 300.00, 52.00),
('D003', '纯碱', '助剂', 1000.00, 3.50);
