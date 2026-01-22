-- 印染ERP系统数据库初始化脚本
-- PostgreSQL 15+

-- 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色表
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_code VARCHAR(50) UNIQUE NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 权限表
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    resource VARCHAR(50),
    action VARCHAR(50),
    description TEXT
);

-- 用户角色关联表
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id)
);

-- 角色权限关联表
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

-- 数据权限表
CREATE TABLE data_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    scope VARCHAR(50) NOT NULL,
    filter_value TEXT
);

-- 客户表
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    default_process VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 物料表（坯布/成品）
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    material_code VARCHAR(50) UNIQUE NOT NULL,
    material_name VARCHAR(200) NOT NULL,
    material_type VARCHAR(50),
    weight DECIMAL(10,2),
    width DECIMAL(10,2),
    color_code VARCHAR(50),
    unit VARCHAR(20) DEFAULT 'kg',
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    safety_stock DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 染化料表
CREATE TABLE dyes (
    id SERIAL PRIMARY KEY,
    dye_code VARCHAR(50) UNIQUE NOT NULL,
    dye_name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    batch_no VARCHAR(50),
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'kg',
    safety_stock DECIMAL(10,2),
    expiry_date DATE,
    unit_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 销售订单表
CREATE TABLE sales_orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    material_id INTEGER REFERENCES materials(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    delivery_date DATE,
    process_flow VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending',
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
    priority INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'pending',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 工序步骤表
CREATE TABLE process_steps (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id) ON DELETE CASCADE,
    step_no INTEGER NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    operator_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 配方表
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    recipe_code VARCHAR(50) UNIQUE NOT NULL,
    recipe_name VARCHAR(200) NOT NULL,
    material_id INTEGER REFERENCES materials(id),
    color_code VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 配方明细表
CREATE TABLE recipe_items (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    dye_id INTEGER REFERENCES dyes(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    sequence INTEGER
);

-- 报工记录表
CREATE TABLE work_reports (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    step_id INTEGER REFERENCES process_steps(id),
    operator_id INTEGER REFERENCES users(id),
    report_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity DECIMAL(10,2),
    status VARCHAR(20),
    remarks TEXT
);

-- 质量问题表
CREATE TABLE quality_issues (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    issue_type VARCHAR(50),
    description TEXT,
    reporter_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 成本记录表
CREATE TABLE cost_records (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    cost_type VARCHAR(50),
    amount DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 能耗日志表
CREATE TABLE energy_logs (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES production_jobs(id),
    energy_type VARCHAR(50),
    consumption DECIMAL(10,2),
    unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 审计日志表
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id INTEGER,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
