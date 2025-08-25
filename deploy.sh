#!/bin/bash

# 小奕畅聊快速部署脚本
# 使用方法: ./deploy.sh [仓库名]

echo "🚀 小奕畅聊快速部署脚本"
echo "=========================="

# 检查Git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ Git未安装，请先安装Git"
    exit 1
fi

# 获取仓库名
REPO_NAME=${1:-xiaoyi-chat}
echo "📁 仓库名: $REPO_NAME"

# 检查是否已有.git目录
if [ -d ".git" ]; then
    echo "⚠️  检测到已存在Git仓库"
    read -p "是否继续？这会覆盖现有的远程仓库配置 (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 部署已取消"
        exit 1
    fi
else
    echo "📦 初始化Git仓库..."
    git init
fi

# 添加所有文件
echo "📝 添加文件到Git..."
git add .

# 检查是否有文件需要提交
if git diff --cached --quiet; then
    echo "⚠️  没有文件需要提交"
else
    echo "💾 提交文件..."
    git commit -m "部署小奕畅聊应用

🌟 功能特性:
- DeepSeek R1模型集成
- 推理思考过程可视化
- 流式输出支持
- 现代化深色主题界面
- 完全响应式设计
- PWA支持

📱 立即体验AI聊天的魅力！"
fi

# 获取GitHub用户名
echo ""
read -p "🔑 请输入你的GitHub用户名: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 用户名不能为空"
    exit 1
fi

# 设置远程仓库
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "🔗 设置远程仓库: $REPO_URL"

# 检查是否已有remote origin
if git remote get-url origin &> /dev/null; then
    echo "🔄 更新远程仓库地址..."
    git remote set-url origin $REPO_URL
else
    echo "➕ 添加远程仓库..."
    git remote add origin $REPO_URL
fi

# 设置主分支
git branch -M main

# 推送到GitHub
echo "🚀 推送到GitHub..."
if git push -u origin main; then
    echo ""
    echo "🎉 代码推送成功！"
    echo ""
    echo "📋 接下来的步骤:"
    echo "1. 访问: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo "2. 进入仓库设置 (Settings)"
    echo "3. 滚动到 'Pages' 部分"
    echo "4. 在 'Source' 中选择 'Deploy from a branch'"
    echo "5. 选择 'main' 分支和 '/ (root)' 目录"
    echo "6. 点击 'Save'"
    echo ""
    echo "⏳ 几分钟后，你的应用将在以下地址可用:"
    echo "🌐 https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
    echo ""
    echo "📖 详细部署指南: https://github.com/$GITHUB_USERNAME/$REPO_NAME/blob/main/DEPLOYMENT.md"
else
    echo ""
    echo "❌ 推送失败！可能的原因："
    echo "1. 仓库不存在 - 请先在GitHub上创建仓库"
    echo "2. 没有推送权限 - 请检查GitHub认证"
    echo "3. 网络连接问题"
    echo ""
    echo "🛠️  手动创建仓库:"
    echo "1. 访问: https://github.com/new"
    echo "2. 仓库名设置为: $REPO_NAME"
    echo "3. 设置为Public（GitHub Pages需要）"
    echo "4. 不要初始化README、.gitignore或license"
    echo "5. 创建后重新运行此脚本"
fi
