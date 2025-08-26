// 小奕畅聊配置文件
// 为了安全考虑，建议根据部署环境选择合适的配置方式

const APP_CONFIG = {
    // 方案一：直接配置默认密钥（简单但不够安全）
    DEFAULT_API_KEY: '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',
    
    // 方案二：环境变量（推荐用于服务器部署）
    // DEFAULT_API_KEY: window.ENV?.OPENROUTER_API_KEY || '',
    
    // 方案三：从URL参数获取（适合临时分享）
    // DEFAULT_API_KEY: new URLSearchParams(window.location.search).get('apikey') || '',
    
    // 默认站点信息
    DEFAULT_SITE_URL: '',
    DEFAULT_SITE_NAME: '小奕畅聊',
    
    // 功能开关
    ENABLE_DEFAULT_KEY: true,
    SHOW_API_KEY_IN_SETTINGS: true,
    SHOW_DEMO_NOTICE: true,
    
    // 安全设置
    MASK_API_KEY_IN_UI: true, // 是否在界面中遮罩API密钥显示
    ALLOW_KEY_OVERRIDE: true, // 是否允许用户覆盖默认密钥
    
    // 调试设置
    DEBUG_MODE: false,        // 是否启用调试模式
    LOG_API_CALLS: false      // 是否记录API调用详情
};

// 导出配置
window.APP_CONFIG = APP_CONFIG;
