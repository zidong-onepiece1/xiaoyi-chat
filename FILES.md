# 📁 小奕畅聊文件说明

## 核心应用文件

| 文件 | 描述 | 必需 |
|------|------|------|
| `index.html` | 主页面文件 | ✅ |
| `style.css` | 样式文件 | ✅ |
| `script.js` | JavaScript逻辑 | ✅ |
| `manifest.json` | PWA配置文件 | 📱 |

## 部署相关文件

| 文件 | 用途 | 平台 |
|------|------|------|
| `local-deploy.sh` | 本地部署脚本 | Mac/Linux |
| `local-deploy.bat` | 本地部署脚本 | Windows |
| `deploy.sh` | GitHub部署脚本 | Mac/Linux |
| `.github/workflows/deploy.yml` | GitHub Actions | GitHub |
| `.gitignore` | Git忽略文件 | Git |

## 文档文件

| 文件 | 内容 |
|------|------|
| `README.md` | 项目介绍和快速开始 |
| `DEPLOYMENT.md` | 详细部署指南 |
| `test-guide.md` | 功能测试指南 |
| `FILES.md` | 文件说明（本文件）|

## 🚀 快速开始

### 本地运行（仅自己访问）
```bash
python -m http.server 8000
```

### 本地部署（其他人访问）
```bash
# Windows
local-deploy.bat

# Mac/Linux  
chmod +x local-deploy.sh && ./local-deploy.sh
```

### 部署到GitHub Pages
```bash
chmod +x deploy.sh && ./deploy.sh
```

## 📱 最小部署包

如果只需要核心功能，最少只需要这4个文件：
- `index.html`
- `style.css` 
- `script.js`
- `manifest.json`（PWA支持，可选）

其他文件都是为了方便部署和使用。
