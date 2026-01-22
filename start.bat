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
if errorlevel 1 (
    echo 警告: 停止容器时出现问题，继续执行...
)

REM 启动所有服务
docker-compose up -d
if errorlevel 1 (
    echo 错误: 启动服务失败！
    echo 请检查 docker-compose.yml 文件是否存在
    echo 或者 Docker Desktop 是否正在运行
    pause
    exit /b 1
)

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
