@echo off
echo ==========================================
echo 印染ERP系统 - 启动脚本
echo ==========================================

REM 检查Docker是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo 错误: Docker未安装，请先安装Docker Desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo 错误: Docker Compose未安装
    pause
    exit /b 1
)

echo.
echo 正在启动服务...
echo.

REM 停止现有容器
docker-compose down

REM 启动所有服务
docker-compose up -d

echo.
echo 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo.
echo 服务状态:
docker-compose ps

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
echo 查看日志: docker-compose logs -f
echo 停止服务: docker-compose down
echo ==========================================
echo.
pause
