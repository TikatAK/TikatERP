#!/bin/bash

echo "=========================================="
echo "印染ERP系统 - 启动脚本"
echo "=========================================="

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "错误: Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "错误: Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

echo ""
echo "正在启动服务..."
echo ""

# 停止现有容器
docker-compose down

# 启动所有服务
docker-compose up -d

echo ""
echo "等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "服务状态:"
docker-compose ps

echo ""
echo "=========================================="
echo "启动完成！"
echo "=========================================="
echo ""
echo "访问地址:"
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:3000"
echo ""
echo "默认账号:"
echo "  用户名: admin"
echo "  密码: admin123"
echo ""
echo "查看日志: docker-compose logs -f"
echo "停止服务: docker-compose down"
echo "=========================================="
