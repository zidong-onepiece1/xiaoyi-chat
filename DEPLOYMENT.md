# 小奕畅聊部署指南

本指南提供多种部署方案，让你的小奕畅聊应用可以被其他人访问。

## 🌐 部署选项概览

| 部署方式 | 费用 | 难度 | 推荐指数 | 适用场景 |
|---------|------|------|----------|----------|
| GitHub Pages | 免费 | ⭐ | ⭐⭐⭐⭐⭐ | 个人项目、开源分享 |
| Netlify | 免费 | ⭐ | ⭐⭐⭐⭐⭐ | 快速部署、自动构建 |
| Vercel | 免费 | ⭐ | ⭐⭐⭐⭐ | 现代化部署体验 |
| 云服务器 | 付费 | ⭐⭐⭐ | ⭐⭐⭐ | 完全控制、自定义域名 |

---

## 🚀 方案一：GitHub Pages（推荐）

### 优点
- 完全免费
- 自动HTTPS
- 可绑定自定义域名
- 版本控制集成

### 部署步骤

#### 1. 创建GitHub仓库
```bash
# 初始化Git仓库
git init
git add .
git commit -m "初始化小奕畅聊项目"

# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/xiaoyi-chat.git
git branch -M main
git push -u origin main
```

#### 2. 启用GitHub Pages
1. 进入仓库设置页面
2. 滚动到"Pages"部分
3. 在"Source"中选择"Deploy from a branch"
4. 选择"main"分支，"/ (root)"目录
5. 点击"Save"

#### 3. 访问地址
几分钟后，你的应用将在以下地址可用：
```
https://你的用户名.github.io/仓库名/
```

#### 4. 自定义域名（可选）
如果你有自己的域名：
1. 在仓库根目录创建`CNAME`文件
2. 在文件中写入你的域名（如：`chat.yourdomain.com`）
3. 在域名DNS中添加CNAME记录指向`你的用户名.github.io`

---

## ⚡ 方案二：Netlify

### 优点
- 免费套餐足够使用
- 拖拽部署
- 自动构建和部署
- 优秀的CDN性能

### 部署步骤

#### 方法1：拖拽部署
1. 访问 [netlify.com](https://netlify.com)
2. 注册/登录账号
3. 将项目文件夹压缩为ZIP
4. 拖拽到Netlify Deploy页面
5. 等待部署完成

#### 方法2：Git集成
1. 将代码推送到GitHub（参考方案一步骤1）
2. 在Netlify中选择"New site from Git"
3. 连接GitHub账号并选择仓库
4. 配置构建设置（保持默认即可）
5. 点击"Deploy site"

#### 3. 自定义域名
在Site settings > Domain management中添加自定义域名

---

## 🔥 方案三：Vercel

### 优点
- 免费套餐
- 极快的全球CDN
- 自动HTTPS
- 优秀的开发体验

### 部署步骤
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击"New Project"
4. 选择你的GitHub仓库
5. 保持默认配置，点击"Deploy"

---

## 🖥️ 方案四：云服务器部署

### 适用场景
- 需要完全控制
- 已有云服务器
- 企业内部部署

### 部署步骤

#### 1. 准备服务器
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Nginx
sudo apt install nginx -y

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2. 上传文件
```bash
# 使用scp上传文件
scp -r ./* user@your-server-ip:/var/www/html/

# 或使用rsync
rsync -avz ./* user@your-server-ip:/var/www/html/
```

#### 3. 配置Nginx
创建配置文件：
```bash
sudo nano /etc/nginx/sites-available/xiaoyi-chat
```

配置内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 4. 启用站点
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/xiaoyi-chat /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

#### 5. 配置HTTPS（推荐）
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d your-domain.com
```

---

## 🌏 方案五：CDN部署

### 使用jsDelivr（免费CDN）
将文件推送到GitHub后，可以通过jsDelivr CDN访问：
```
https://cdn.jsdelivr.net/gh/你的用户名/仓库名@main/index.html
```

---

## 📱 移动端优化建议

### PWA支持
创建`manifest.json`文件：
```json
{
  "name": "小奕畅聊",
  "short_name": "小奕畅聊",
  "description": "基于DeepSeek R1的AI聊天应用",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0b",
  "theme_color": "#4285f4",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

在`index.html`的`<head>`中添加：
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#4285f4">
```

---

## 🔒 安全注意事项

### API密钥保护
⚠️ **重要提醒**：
- 用户的OpenRouter API密钥存储在本地浏览器中
- 不会被发送到你的服务器
- 每个用户需要输入自己的API密钥
- 你可以在设置面板中提供使用说明

### 建议添加的安全提示
在HTML中添加API密钥说明：
```html
<div class="api-notice">
  <h4>🔐 隐私保护</h4>
  <p>您的API密钥仅存储在本地浏览器中，不会被发送到我们的服务器。</p>
  <p>请从 <a href="https://openrouter.ai" target="_blank">OpenRouter</a> 获取您自己的API密钥。</p>
</div>
```

---

## 📊 流量监控

### 添加Google Analytics（可选）
在`index.html`的`<head>`中添加：
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

---

## 🎉 推荐部署流程

对于大多数用户，推荐按以下顺序尝试：

1. **GitHub Pages**（最简单免费）
2. **Netlify**（功能更强大）
3. **Vercel**（现代化体验）
4. **云服务器**（需要完全控制时）

### 快速开始命令
```bash
# 1. 初始化Git仓库
git init
git add .
git commit -m "部署小奕畅聊"

# 2. 推送到GitHub
git remote add origin https://github.com/你的用户名/xiaoyi-chat.git
git push -u origin main

# 3. 在GitHub中启用Pages，几分钟后即可访问！
```

部署成功后，记得在README中更新访问链接，方便其他人使用你的小奕畅聊！🚀
