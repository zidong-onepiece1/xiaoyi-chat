# 📁 小奕畅聊文件说明

## 核心应用文件

| 文件 | 描述 | 必需 |
|------|------|------|
| `index.html` | 主页面文件 | ✅ |
| `style.css` | 样式文件 | ✅ |
| `script.js` | JavaScript逻辑 | ✅ |
| `config.js` | 配置文件（包含默认API密钥）| ✅ |
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
| `API_KEY_SETUP.md` | API密钥配置详细说明 |
| `TROUBLESHOOTING.md` | 故障排除和错误诊断指南 |
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

如果只需要核心功能，最少只需要这5个文件：
- `index.html`
- `style.css` 
- `script.js`
- `config.js`（包含默认API密钥配置）
- `manifest.json`（PWA支持，可选）

其他文件都是为了方便部署和使用。

## 🔑 API密钥配置说明

默认API密钥已配置在 `config.js` 中，用户可直接使用：
- ✅ **开箱即用** - 无需配置即可体验
- ✅ **演示友好** - 适合快速分享和演示
- ⚠️ **安全提醒** - 建议生产环境使用自己的密钥

详细配置说明请查看 [API_KEY_SETUP.md](API_KEY_SETUP.md)

