@echo off
echo ==========================================
echo 印染ERP系统 - 本地启动脚本
echo ==========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: Node.js未安装
    pause
    exit /b 1
)

echo [1/4] 启动 PostgreSQL 数据库...
docker-compose up -d postgres
if errorlevel 1 (
    echo 错误: 数据库启动失败
    pause
    exit /b 1
)

echo.
echo [2/4] 等待数据库初始化...
timeout /t 5 /nobreak >nul

echo.
echo [3/4] 安装后端依赖并启动...
cd backend
if not exist node_modules (
    echo 正在安装后端依赖...
    call npm install
)
if not exist .env (
    echo 创建后端环境配置...
    copy .env.example .env
)
start "ERP-Backend" cmd /k "npm run start:dev"

echo.
echo [4/4] 安装前端依赖并启动...
cd ..\frontend
if not exist node_modules (
    echo 正在安装前端依赖...
    call npm install
)
start "ERP-Frontend" cmd /k "npm run dev"

cd ..
echo.
echo ==========================================
echo 启动完成！
echo ==========================================
echo.
echo 访问地址:
echo   前端: http://localhost:5173
echo   后端: http://localhost:3000
echo.
echo 默认账号:
echo   用户名: admin
echo   密码: admin123
echo.
pause
