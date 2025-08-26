#!/bin/bash

# 小奕畅聊本地部署脚本
# 让其他人能访问你的本地部署

echo "🏠 小奕畅聊本地部署脚本"
echo "========================="

# 检查端口是否被占用
PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; do
    echo "⚠️  端口 $PORT 已被占用，尝试端口 $((PORT+1))"
    PORT=$((PORT+1))
done

echo "🌐 使用端口: $PORT"

# 获取本机IP地址
get_local_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        LOCAL_IP=$(ip route get 1.1.1.1 | awk '{print $7}' | head -1)
    else
        # Windows (Git Bash)
        LOCAL_IP=$(ipconfig | grep "IPv4" | head -1 | awk '{print $NF}')
    fi
    echo $LOCAL_IP
}

LOCAL_IP=$(get_local_ip)
echo "💻 本机IP地址: $LOCAL_IP"

# 显示访问信息
echo ""
echo "🚀 启动本地服务器..."
echo ""
echo "📍 本地访问地址:"
echo "   http://localhost:$PORT"
echo "   http://127.0.0.1:$PORT"
echo ""
echo "🌐 局域网访问地址:"
echo "   http://$LOCAL_IP:$PORT"
echo ""
echo "📋 分享给其他人:"
echo "   同一WiFi网络下的用户可以访问: http://$LOCAL_IP:$PORT"
echo ""
echo "🔗 想要外网访问？"
echo "   1. 安装 ngrok: https://ngrok.com/"
echo "   2. 运行: ngrok http $PORT"
echo "   3. 或使用 localtunnel: npx localtunnel --port $PORT"
echo ""
echo "⏹️  按 Ctrl+C 停止服务"
echo "========================="

# 检查Python是否安装
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT --bind 0.0.0.0
elif command -v python &> /dev/null; then
    python -m http.server $PORT --bind 0.0.0.0
elif command -v node &> /dev/null; then
    echo "使用Node.js serve..."
    npx serve . -l $PORT
else
    echo "❌ 需要安装Python或Node.js来运行本地服务器"
    echo ""
    echo "安装方法："
    echo "Python: https://python.org"
    echo "Node.js: https://nodejs.org"
    exit 1
fi

