# 🔧 故障排除指南

当你遇到 "Provider returned error" 或其他API错误时，请按照以下步骤进行诊断和解决。

## 🚨 常见错误及解决方案

### 1. "Provider returned error"

这是一个通用的API错误，具体原因需要查看详细信息。

#### 🔍 诊断步骤：

1. **打开浏览器开发者工具**
   - Windows: `F12` 或 `Ctrl+Shift+I`
   - Mac: `Cmd+Option+I`
   - 点击 "Console" 标签

2. **查看详细错误信息**
   - 在Console中查找红色的错误信息
   - 查找以 "API Error Response:" 开头的日志

3. **使用API连接测试**
   - 打开设置面板（点击右上角⚙️图标）
   - 点击 "测试连接" 按钮
   - 查看测试结果

#### 💡 常见原因及解决方案：

| 错误信息 | 原因 | 解决方案 |
|---------|------|----------|
| "API密钥无效或已过期" | API密钥错误 | 检查并更新API密钥 |
| "账户余额不足" | OpenRouter余额不足 | 前往OpenRouter.ai充值 |
| "请求频率过高" | 请求太频繁 | 等待几秒后重试 |
| "模型暂时不可用" | DeepSeek模型故障 | 稍后重试或尝试其他模型 |
| "HTTP 401" | 认证失败 | 检查API密钥格式和有效性 |
| "HTTP 403" | 权限不足 | 检查账户状态和API密钥权限 |
| "HTTP 429" | 超出限制 | 降低请求频率 |
| "HTTP 500" | 服务器错误 | OpenRouter服务故障，稍后重试 |

### 2. API密钥相关问题

#### ❌ "API密钥格式不正确"
- **原因**: API密钥格式错误
- **解决**: 确保密钥以 `sk-or-v1-` 开头
- **示例**: `sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### ❌ "请先设置OpenRouter API Key"
- **原因**: 没有配置API密钥
- **解决**: 在设置中输入有效的API密钥

#### ❌ "API密钥无效或已过期"
- **原因**: 密钥错误、被删除或过期
- **解决**: 
  1. 登录 [OpenRouter.ai](https://openrouter.ai)
  2. 检查API密钥状态
  3. 创建新的API密钥

### 3. 网络连接问题

#### ❌ "网络连接失败"
- **原因**: 网络问题或防火墙阻拦
- **解决**: 
  1. 检查网络连接
  2. 尝试关闭VPN
  3. 检查防火墙设置
  4. 尝试刷新页面

#### ❌ "CORS错误"
- **原因**: 跨域请求被阻拦
- **解决**: 使用HTTPS访问，或在本地服务器运行

### 4. 余额和配额问题

#### ❌ "账户余额不足"
- **原因**: OpenRouter账户余额为零
- **解决**:
  1. 访问 [OpenRouter.ai](https://openrouter.ai)
  2. 进入 "Billing" 或 "账单" 页面
  3. 添加支付方式并充值
  4. 建议充值 $5-10 用于测试

#### ❌ "超出使用限制"
- **原因**: 触发了API调用限制
- **解决**: 
  1. 等待限制重置（通常1小时）
  2. 升级OpenRouter账户套餐
  3. 优化API调用频率

## 🛠️ 高级诊断

### 启用调试模式

修改 `config.js` 文件：

```javascript
const APP_CONFIG = {
    // 启用调试模式
    DEBUG_MODE: true,        
    LOG_API_CALLS: true,
    
    // ... 其他配置
};
```

启用后，控制台会显示详细的调试信息。

### 手动测试API

你可以直接测试OpenRouter API：

```bash
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-r1:free",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'
```

### 检查模型可用性

访问 [OpenRouter Models](https://openrouter.ai/models) 页面，确认 `deepseek/deepseek-r1:free` 模型状态。

## 🔍 详细诊断清单

在报告问题前，请完成以下检查：

### 基础检查
- [ ] 浏览器控制台无JavaScript错误
- [ ] API密钥格式正确（sk-or-v1-开头）
- [ ] 网络连接正常
- [ ] 页面通过HTTPS或本地服务器访问

### API密钥检查
- [ ] 在OpenRouter.ai确认密钥存在且激活
- [ ] 账户余额充足（建议>$1）
- [ ] 使用"测试连接"功能验证密钥

### 环境检查
- [ ] 浏览器版本支持（Chrome 90+, Firefox 88+, Safari 14+）
- [ ] 未使用过激进的广告拦截器
- [ ] 防火墙/企业网络未阻拦OpenRouter域名

### 错误信息收集
- [ ] 复制完整的控制台错误信息
- [ ] 记录错误发生的具体步骤
- [ ] 截图相关错误界面

## 📞 获取帮助

### 自助排查
1. **查看日志**: 控制台 → Console标签
2. **测试连接**: 设置 → 测试连接按钮
3. **重置设置**: 清除浏览器缓存和Local Storage

### OpenRouter支持
- 📧 邮箱: support@openrouter.ai
- 🌐 帮助中心: [OpenRouter Help](https://openrouter.ai/help)
- 💬 Discord: OpenRouter官方Discord频道

### 应用相关问题
- 🐛 查看浏览器控制台错误
- 🔄 尝试刷新页面
- 🧹 清除浏览器缓存
- 🚀 尝试无痕/隐私模式

## ⚡ 快速解决方案

对于大多数问题，以下快速方案通常有效：

1. **刷新页面** - 解决临时问题
2. **清除缓存** - 解决配置冲突
3. **检查余额** - 确保账户有资金
4. **测试连接** - 验证API密钥
5. **等待重试** - 应对临时服务故障

## 🎯 预防措施

为避免问题再次发生：

1. **定期检查余额** - 设置低余额提醒
2. **备份API密钥** - 安全存储备用密钥
3. **监控使用量** - 定期查看API调用统计
4. **更新及时** - 关注OpenRouter服务状态
5. **测试环境** - 重要部署前先测试

记住：大部分API错误都是配置问题，仔细检查通常都能解决！🎉
