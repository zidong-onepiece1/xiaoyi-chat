# 小奕畅聊 - DeepSeek风格AI聊天应用

一个基于DeepSeek R1模型的现代化AI聊天界面，通过OpenRouter API提供服务。

## ✨ 特性

- 🎨 **现代化设计** - 深色主题，类似DeepSeek官方界面
- 🚀 **流畅体验** - 实时对话，响应式设计
- 🔧 **可配置** - 支持自定义API密钥和站点信息
- 📱 **移动友好** - 完全响应式，支持各种设备
- 💬 **智能对话** - 基于DeepSeek R1模型的强大AI能力
- 🧠 **推理透明** - 可视化显示AI的推理思考过程
- 📝 **Markdown支持** - 支持代码高亮和格式化显示

## 🚀 快速开始

### 1. 获取OpenRouter API密钥

1. 访问 [OpenRouter.ai](https://openrouter.ai)
2. 注册账号并获取API密钥
3. 确保账户有足够的额度

### 2. 部署应用

#### 方法一：本地部署
```bash
# 克隆或下载项目文件
# 确保所有文件在同一目录下：
# - index.html
# - style.css  
# - script.js
# - README.md

# 使用任何静态文件服务器，例如：
python -m http.server 8000
# 或者
npx serve .
# 或者直接用浏览器打开 index.html
```

#### 方法二：在线部署
上传到任何静态网站托管服务：
- GitHub Pages
- Netlify
- Vercel
- 或任何其他静态托管服务

### 3. 配置API密钥

1. 打开应用
2. 点击右上角设置按钮 ⚙️
3. 输入你的OpenRouter API密钥
4. （可选）输入网站URL和名称
5. 点击"保存"

### 4. 开始聊天

- 点击预设问题快速开始
- 或直接在底部输入框输入你的问题
- 按Enter发送，Shift+Enter换行

## 🎯 使用说明

### 界面布局

- **左侧边栏**：聊天历史和新建对话
- **主聊天区**：显示对话内容
- **输入区**：发送消息
- **设置面板**：配置API密钥等选项

### 键盘快捷键

- `Enter` - 发送消息
- `Shift + Enter` - 换行
- `Escape` - 关闭设置面板

### 推理思考功能

小奕畅聊支持显示DeepSeek R1模型的内部推理思考过程：

- **思考展示**：每条AI回复都可能包含推理思考内容
- **折叠控制**：点击"🧠 推理思考过程"可展开/收起思考内容
- **开关控制**：在设置中可全局开启/关闭思考内容显示
- **透明AI**：了解AI是如何得出答案的，增强可信度

### API配置

应用需要以下配置：

| 配置项 | 是否必需 | 说明 |
|--------|----------|------|
| API Key | 必需 | OpenRouter API密钥 |
| 网站URL | 可选 | 用于OpenRouter统计排名 |
| 网站名称 | 可选 | 用于OpenRouter统计排名 |
| 显示思考过程 | 可选 | 是否显示AI推理思考过程（默认开启）|

## 🔧 自定义配置

### 模型设置

当前使用的模型：`deepseek/deepseek-r1:free`

如需更改模型，请修改 `script.js` 文件中的以下部分：

```javascript
const requestBody = {
    "model": "deepseek/deepseek-r1:free", // 在这里修改模型
    // ... 其他配置
};
```

### 样式自定义

在 `style.css` 文件的 `:root` 部分修改CSS变量：

```css
:root {
    --bg-primary: #0a0a0b;      /* 主背景色 */
    --bg-secondary: #1a1a1b;    /* 次要背景色 */
    --accent-color: #4285f4;    /* 主题色 */
    /* ... 更多变量 */
}
```

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **API**: OpenRouter API
- **模型**: DeepSeek R1
- **依赖**: Marked.js (Markdown渲染)
- **字体**: Inter, Google Fonts

## 📱 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 隐私说明

- API密钥存储在本地浏览器中
- 对话历史仅在当前会话中保存
- 不会向第三方发送任何数据（除OpenRouter API调用）

## 📄 许可证

本项目仅供学习和个人使用。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📞 支持

如有问题，请：

1. 检查API密钥是否正确配置
2. 确认网络连接正常
3. 查看浏览器控制台错误信息
4. 检查OpenRouter账户余额

## 🎉 开始使用

现在就打开 `index.html`，配置你的API密钥，开始与AI对话吧！

## 🌐 部署到公网

想让其他人也能访问你的小奕畅聊？查看详细的 **[部署指南](DEPLOYMENT.md)**

### 🚀 快速部署（推荐）

最简单的部署方式是使用GitHub Pages：

```bash
# 1. 初始化Git仓库
git init
git add .
git commit -m "部署小奕畅聊"

# 2. 推送到GitHub
git remote add origin https://github.com/你的用户名/xiaoyi-chat.git
git push -u origin main

# 3. 在GitHub仓库设置中启用Pages
```

几分钟后，你的应用将在 `https://你的用户名.github.io/xiaoyi-chat/` 可用！

### 🏠 本地部署（让其他人访问）

如果你想在本地运行并让其他人访问：

#### 局域网访问（同一WiFi）
```bash
# Windows用户
local-deploy.bat

# Mac/Linux用户
chmod +x local-deploy.sh
./local-deploy.sh
```

#### 外网访问（内网穿透）
```bash
# 1. 启动本地服务
python -m http.server 8000

# 2. 使用ngrok创建隧道
ngrok http 8000

# 3. 或使用localtunnel（无需注册）
npx localtunnel --port 8000
```

### 📋 云端部署选项
- **GitHub Pages** - 免费，自动HTTPS
- **Netlify** - 拖拽部署，CDN加速  
- **Vercel** - 现代化体验，全球CDN
- **云服务器** - 完全控制，企业部署

详细步骤请查看 [DEPLOYMENT.md](DEPLOYMENT.md)
# xiaoyi-chat
