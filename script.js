// 全局变量
let apiKey = '';
let siteUrl = '';
let siteName = '';
let showThinking = true;
let enableStreaming = true;
let conversationHistory = [];
let isGenerating = false;

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 加载保存的设置
    loadSettings();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化UI状态
    updateUIState();
    
    // 检查API密钥状态
    updateApiStatus();
}

function bindEventListeners() {
    // 输入框事件
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('paste', handlePaste);
        messageInput.addEventListener('input', adjustTextareaHeight);
    }
    
    // 全局键盘事件
    document.addEventListener('keydown', handleGlobalKeydown);
    
    // 点击外部关闭设置面板
    document.addEventListener('click', function(e) {
        const settingsPanel = document.getElementById('settingsPanel');
        const settingsBtn = document.querySelector('.settings-btn');
        
        if (settingsPanel && settingsPanel.classList.contains('active') && 
            !settingsPanel.contains(e.target) && 
            !settingsBtn.contains(e.target)) {
            toggleSettings();
        }
    });
}

// 设置管理
function loadSettings() {
    try {
        apiKey = localStorage.getItem('openrouter_api_key') || '';
        siteUrl = localStorage.getItem('site_url') || '';
        siteName = localStorage.getItem('site_name') || '';
        showThinking = localStorage.getItem('show_thinking') !== 'false'; // 默认为true
        enableStreaming = localStorage.getItem('enable_streaming') !== 'false'; // 默认为true
        
        // 设置输入框的值
        const apiKeyInput = document.getElementById('apiKey');
        const siteUrlInput = document.getElementById('siteUrl');
        const siteNameInput = document.getElementById('siteName');
        const showThinkingInput = document.getElementById('showThinking');
        const enableStreamingInput = document.getElementById('enableStreaming');
        
        if (apiKeyInput && apiKey) apiKeyInput.value = apiKey;
        if (siteUrlInput && siteUrl) siteUrlInput.value = siteUrl;
        if (siteNameInput && siteName) siteNameInput.value = siteName;
        if (showThinkingInput) showThinkingInput.checked = showThinking;
        if (enableStreamingInput) enableStreamingInput.checked = enableStreaming;
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function saveApiKey() {
    try {
        const apiKeyInput = document.getElementById('apiKey');
        const siteUrlInput = document.getElementById('siteUrl');
        const siteNameInput = document.getElementById('siteName');
        const showThinkingInput = document.getElementById('showThinking');
        const enableStreamingInput = document.getElementById('enableStreaming');
        
        if (apiKeyInput) {
            apiKey = apiKeyInput.value.trim();
            localStorage.setItem('openrouter_api_key', apiKey);
        }
        
        if (siteUrlInput) {
            siteUrl = siteUrlInput.value.trim();
            localStorage.setItem('site_url', siteUrl);
        }
        
        if (siteNameInput) {
            siteName = siteNameInput.value.trim();
            localStorage.setItem('site_name', siteName);
        }
        
        if (showThinkingInput) {
            showThinking = showThinkingInput.checked;
            localStorage.setItem('show_thinking', showThinking.toString());
        }
        
        if (enableStreamingInput) {
            enableStreaming = enableStreamingInput.checked;
            localStorage.setItem('enable_streaming', enableStreaming.toString());
        }
        
        updateApiStatus();
        showNotification('设置已保存', 'success');
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('保存设置时出错', 'error');
    }
}

function updateApiStatus() {
    const statusIndicator = document.getElementById('apiStatus');
    if (statusIndicator) {
        if (apiKey) {
            statusIndicator.style.backgroundColor = 'var(--success-color)';
            statusIndicator.style.boxShadow = '0 0 0 2px rgba(52, 168, 83, 0.2)';
        } else {
            statusIndicator.style.backgroundColor = 'var(--warning-color)';
            statusIndicator.style.boxShadow = '0 0 0 2px rgba(251, 188, 4, 0.2)';
        }
    }
}

// UI交互
function toggleSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsPanel) {
        settingsPanel.classList.toggle('active');
    }
}

function adjustTextareaHeight() {
    const textarea = document.getElementById('messageInput');
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
}

function handleInputKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function handleGlobalKeydown(event) {
    // Escape关闭设置面板
    if (event.key === 'Escape') {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel && settingsPanel.classList.contains('active')) {
            toggleSettings();
        }
    }
}

function handlePaste(event) {
    // 处理粘贴事件，可以在这里添加文件上传等功能
    console.log('Paste event handled');
}

// 聊天功能
function sendPrompt(promptText) {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.value = promptText;
        adjustTextareaHeight();
        sendMessage();
    }
}

async function sendMessage() {
    if (isGenerating) {
        return;
    }
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) {
        return;
    }
    
    if (!apiKey) {
        showNotification('请先设置OpenRouter API Key', 'warning');
        toggleSettings();
        return;
    }
    
    // 清空输入框
    messageInput.value = '';
    adjustTextareaHeight();
    
    // 隐藏欢迎界面
    hideWelcomeScreen();
    
    // 添加用户消息
    addMessage('user', message);
    
    // 添加到对话历史
    conversationHistory.push({
        role: 'user',
        content: message
    });
    
    try {
        isGenerating = true;
        updateSendButtonState();
        
        if (enableStreaming) {
            // 使用流式输出
            let streamingMessageElement = createStreamingMessage();
            let fullStreamContent = '';
            
            await callOpenRouterAPIStreaming(
                message,
                // onChunk - 处理每个数据块
                (chunk, fullContent) => {
                    fullStreamContent = fullContent;
                    updateStreamingMessage(streamingMessageElement, fullContent);
                },
                // onComplete - 流式完成
                (finalContent) => {
                    fullStreamContent = finalContent;
                    
                    // 解析思考内容并更新最终显示
                    const parsed = parseThinkingContent(finalContent);
                    updateStreamingMessageFinal(streamingMessageElement, parsed.content, parsed.thinking);
                    
                    // 添加到对话历史
                    conversationHistory.push({
                        role: 'assistant',
                        content: finalContent
                    });
                    
                    // 更新聊天标题
                    updateChatTitle(message);
                },
                // onError - 处理错误
                (error) => {
                    console.error('Streaming error:', error);
                    if (streamingMessageElement) {
                        streamingMessageElement.remove();
                    }
                    addMessage('system', `错误: ${error.message || '无法连接到API服务'}`);
                    showNotification('发送消息失败', 'error');
                }
            );
        } else {
            // 使用非流式输出
            const loadingElement = showLoadingMessage();
            
            try {
                const response = await callOpenRouterAPI(message);
                
                // 移除加载消息
                if (loadingElement) {
                    loadingElement.remove();
                }
                
                // 添加AI回复
                if (response && response.content) {
                    addMessage('assistant', response.content);
                    
                    // 添加到对话历史
                    conversationHistory.push({
                        role: 'assistant',
                        content: response.content
                    });
                    
                    // 更新聊天标题
                    updateChatTitle(message);
                } else {
                    throw new Error('Empty response from API');
                }
                
            } catch (error) {
                // 移除加载消息
                if (loadingElement) {
                    loadingElement.remove();
                }
                throw error; // 重新抛出错误，让外层catch处理
            }
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        
        // 显示错误消息
        addMessage('system', `错误: ${error.message || '无法连接到API服务'}`);
        showNotification('发送消息失败', 'error');
        
    } finally {
        isGenerating = false;
        updateSendButtonState();
        
        // 聚焦到输入框
        messageInput.focus();
    }
}

async function callOpenRouterAPIStreaming(message, onChunk, onComplete, onError) {
    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
    };
    
    // 添加可选的头部信息
    if (siteUrl) {
        headers["HTTP-Referer"] = siteUrl;
    }
    
    if (siteName) {
        headers["X-Title"] = siteName;
    }
    
    const requestBody = {
        "model": "deepseek/deepseek-r1:free",
        "messages": conversationHistory.concat([{
            role: "user",
            content: message
        }]),
        "temperature": 0.7,
        "max_tokens": 4000,
        "stream": true
    };
    
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            let errorMessage = '请求失败';
            
            try {
                const errorJson = JSON.parse(errorData);
                errorMessage = errorJson.error?.message || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            throw new Error(errorMessage);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                break;
            }
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            // 保留最后一行（可能不完整）
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6).trim();
                    
                    if (data === '[DONE]') {
                        continue;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        
                        if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                            const chunk = parsed.choices[0].delta.content;
                            fullContent += chunk;
                            
                            if (onChunk) {
                                onChunk(chunk, fullContent);
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to parse SSE data:', data);
                    }
                }
            }
        }
        
        if (onComplete) {
            onComplete(fullContent);
        }
        
        return { content: fullContent };
        
    } catch (error) {
        if (onError) {
            onError(error);
        }
        throw error;
    }
}

// 保持向后兼容的非流式API调用
async function callOpenRouterAPI(message) {
    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };
    
    // 添加可选的头部信息
    if (siteUrl) {
        headers["HTTP-Referer"] = siteUrl;
    }
    
    if (siteName) {
        headers["X-Title"] = siteName;
    }
    
    const requestBody = {
        "model": "deepseek/deepseek-r1:free",
        "messages": conversationHistory.concat([{
            role: "user",
            content: message
        }]),
        "temperature": 0.7,
        "max_tokens": 4000,
        "stream": false
    };
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = '请求失败';
        
        try {
            const errorJson = JSON.parse(errorData);
            errorMessage = errorJson.error?.message || errorMessage;
        } catch (e) {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message;
    } else {
        throw new Error('Invalid response format');
    }
}

// 消息显示
function hideWelcomeScreen() {
    const welcomeScreen = document.querySelector('.welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
}

function createStreamingMessage() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return null;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message streaming-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar assistant-avatar';
    avatar.textContent = '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    
    const senderName = document.createElement('div');
    senderName.className = 'message-sender';
    senderName.textContent = 'DeepSeek R1';
    
    const timestamp = document.createElement('div');
    timestamp.className = 'message-time';
    timestamp.textContent = new Date().toLocaleTimeString();
    
    messageHeader.appendChild(senderName);
    messageHeader.appendChild(timestamp);
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text streaming-text';
    messageText.innerHTML = '<span class="cursor">|</span>';
    
    messageContent.appendChild(messageHeader);
    messageContent.appendChild(messageText);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

function updateStreamingMessage(messageElement, content) {
    if (!messageElement) return;
    
    const messageText = messageElement.querySelector('.message-text');
    if (messageText) {
        // 渲染markdown内容并添加光标
        if (typeof marked !== 'undefined') {
            messageText.innerHTML = marked.parse(content) + '<span class="cursor">|</span>';
        } else {
            messageText.innerHTML = content.replace(/\n/g, '<br>') + '<span class="cursor">|</span>';
        }
        scrollToBottom();
    }
}

function updateStreamingMessageFinal(messageElement, finalContent, thinkingContent) {
    if (!messageElement) return;
    
    // 移除streaming样式
    messageElement.classList.remove('streaming-message');
    
    const messageContent = messageElement.querySelector('.message-content');
    const messageHeader = messageElement.querySelector('.message-header');
    
    // 清空现有内容，重新构建
    messageContent.innerHTML = '';
    messageContent.appendChild(messageHeader);
    
    // 如果有思考内容且设置为显示，添加思考区域
    if (thinkingContent && showThinking) {
        const thinkingSection = createThinkingSection(thinkingContent);
        messageContent.appendChild(thinkingSection);
    }
    
    // 添加最终回答内容
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    
    // 渲染最终markdown内容
    if (typeof marked !== 'undefined') {
        messageText.innerHTML = marked.parse(finalContent);
    } else {
        messageText.textContent = finalContent;
    }
    
    messageContent.appendChild(messageText);
    scrollToBottom();
}

function parseThinkingContent(content) {
    // 解析DeepSeek R1的思考内容和回答内容
    // DeepSeek R1可能使用多种格式标记思考内容
    let thinking = null;
    let actualContent = content;
    
    // 尝试多种可能的格式
    const patterns = [
        /<think>([\s\S]*?)<\/think>/,  // <think></think>
        /<thinking>([\s\S]*?)<\/thinking>/, // <thinking></thinking>
        /\*\*思考过程:\*\*([\s\S]*?)\*\*回答:\*\*/, // **思考过程:**...**回答:**
        /【思考】([\s\S]*?)【回答】/, // 【思考】...【回答】
        /思考过程：\n([\s\S]*?)\n\n(?=答案|回答|结论)/, // 思考过程：...
    ];
    
    for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
            thinking = match[1].trim();
            actualContent = content.replace(pattern, '').trim();
            break;
        }
    }
    
    // 如果没有找到明确的标记，检查是否整体内容包含推理过程
    if (!thinking && content.length > 200) {
        // 尝试智能检测推理内容（基于关键词）
        const reasoningKeywords = ['因为', '所以', '首先', '然后', '接下来', '综上', '因此', '由于', '考虑到', '分析', '推理', '思考'];
        const hasReasoning = reasoningKeywords.some(keyword => content.includes(keyword));
        
        if (hasReasoning) {
            // 如果内容很长且包含推理关键词，尝试分割
            const sentences = content.split(/[。！？\n]/);
            if (sentences.length > 3) {
                const midPoint = Math.floor(sentences.length * 0.6);
                thinking = sentences.slice(0, midPoint).join('。') + '。';
                actualContent = sentences.slice(midPoint).join('。');
            }
        }
    }
    
    return {
        thinking: thinking,
        content: actualContent || content
    };
}

function createThinkingSection(thinkingContent) {
    const thinkingSection = document.createElement('div');
    thinkingSection.className = 'thinking-section collapsed';
    
    const thinkingHeader = document.createElement('div');
    thinkingHeader.className = 'thinking-header';
    thinkingHeader.onclick = () => toggleThinking(thinkingSection);
    
    const thinkingTitle = document.createElement('div');
    thinkingTitle.className = 'thinking-title';
    thinkingTitle.innerHTML = `
        <span>🧠</span>
        <span>推理思考过程</span>
    `;
    
    const thinkingIcon = document.createElement('div');
    thinkingIcon.className = 'thinking-icon';
    thinkingIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"/>
        </svg>
    `;
    
    thinkingHeader.appendChild(thinkingTitle);
    thinkingHeader.appendChild(thinkingIcon);
    
    const thinkingContentDiv = document.createElement('div');
    thinkingContentDiv.className = 'thinking-content';
    thinkingContentDiv.textContent = thinkingContent;
    
    thinkingSection.appendChild(thinkingHeader);
    thinkingSection.appendChild(thinkingContentDiv);
    
    return thinkingSection;
}

function toggleThinking(thinkingSection) {
    thinkingSection.classList.toggle('collapsed');
}

function addMessage(role, content) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${role === 'user' ? 'user-avatar' : (role === 'assistant' ? 'assistant-avatar' : 'system-avatar')}`;
    
    let avatarContent = '🤖';
    if (role === 'user') {
        avatarContent = '👤';
    } else if (role === 'system') {
        avatarContent = '⚠️';
    }
    avatar.textContent = avatarContent;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    
    const senderName = document.createElement('div');
    senderName.className = 'message-sender';
    senderName.textContent = role === 'user' ? '你' : (role === 'assistant' ? 'DeepSeek R1' : '系统');
    
    const timestamp = document.createElement('div');
    timestamp.className = 'message-time';
    timestamp.textContent = new Date().toLocaleTimeString();
    
    messageHeader.appendChild(senderName);
    messageHeader.appendChild(timestamp);
    
    // 解析思考内容（仅对assistant消息）
    let actualContent = content;
    let thinkingContent = null;
    
    if (role === 'assistant') {
        const parsed = parseThinkingContent(content);
        actualContent = parsed.content;
        thinkingContent = parsed.thinking;
    }
    
    // 如果有思考内容且设置为显示思考内容，先添加思考区域
    if (thinkingContent && showThinking) {
        const thinkingSection = createThinkingSection(thinkingContent);
        messageContent.appendChild(messageHeader);
        messageContent.appendChild(thinkingSection);
    } else {
        messageContent.appendChild(messageHeader);
    }
    
    // 添加实际回答内容
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    
    // 使用marked.js渲染Markdown（如果内容是Markdown格式）
    if (typeof marked !== 'undefined' && role === 'assistant') {
        messageText.innerHTML = marked.parse(actualContent);
    } else {
        messageText.textContent = actualContent;
    }
    
    messageContent.appendChild(messageText);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    scrollToBottom();
    
    return messageDiv;
}

function showLoadingMessage() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return null;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message loading-message';
    loadingDiv.innerHTML = `
        <div class="message-avatar assistant-avatar">🤖</div>
        <div class="message-content">
            <div class="message-header">
                <div class="message-sender">DeepSeek R1</div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
            <div class="message-text">
                <span>正在思考</span>
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(loadingDiv);
    scrollToBottom();
    
    return loadingDiv;
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// UI状态更新
function updateUIState() {
    updateSendButtonState();
}

function updateSendButtonState() {
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    
    if (sendBtn && messageInput) {
        const hasText = messageInput.value.trim().length > 0;
        sendBtn.disabled = isGenerating || !hasText || !apiKey;
        
        if (isGenerating) {
            sendBtn.innerHTML = `
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            `;
        } else {
            sendBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2z"/>
                </svg>
            `;
        }
    }
}

// 聊天管理
function startNewChat() {
    // 清空对话历史
    conversationHistory = [];
    
    // 清空聊天界面
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="welcome-screen">
                <div class="welcome-icon">🚀</div>
                                    <h2>欢迎使用小奕畅聊</h2>
                <p>基于 DeepSeek R1 模型，通过 OpenRouter API 提供强大的AI对话能力</p>
                <div class="example-prompts">
                    <div class="prompt-card" onclick="sendPrompt('你好，请介绍一下你自己')">
                        <div class="prompt-icon">👋</div>
                        <div class="prompt-text">你好，请介绍一下你自己</div>
                    </div>
                    <div class="prompt-card" onclick="sendPrompt('帮我写一个Python函数')">
                        <div class="prompt-icon">🐍</div>
                        <div class="prompt-text">帮我写一个Python函数</div>
                    </div>
                    <div class="prompt-card" onclick="sendPrompt('解释一下量子计算的基本原理')">
                        <div class="prompt-icon">⚛️</div>
                        <div class="prompt-text">解释一下量子计算的基本原理</div>
                    </div>
                    <div class="prompt-card" onclick="sendPrompt('创作一个短故事')">
                        <div class="prompt-icon">📚</div>
                        <div class="prompt-text">创作一个短故事</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 更新聊天历史UI
    updateChatHistoryUI();
    
    showNotification('已开始新对话', 'success');
}

function selectChat(element) {
    // 移除其他选中状态
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加选中状态
    element.classList.add('active');
}

function updateChatTitle(firstMessage) {
    const activeChat = document.querySelector('.chat-item.active .chat-title');
    if (activeChat) {
        // 使用第一条消息的前30个字符作为标题
        const title = firstMessage.length > 30 ? 
                     firstMessage.substring(0, 30) + '...' : 
                     firstMessage;
        activeChat.textContent = title;
    }
}

function updateChatHistoryUI() {
    // 这里可以添加更复杂的聊天历史管理逻辑
    console.log('Chat history updated');
}

// 通知系统
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'accent'}-color);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all var(--transition-normal);
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    // 3秒后自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 监听输入框变化，更新发送按钮状态
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            updateSendButtonState();
        });
    }
});

// 错误处理
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// 导出主要函数供HTML调用
window.sendMessage = sendMessage;
window.sendPrompt = sendPrompt;
window.startNewChat = startNewChat;
window.selectChat = selectChat;
window.toggleSettings = toggleSettings;
window.saveApiKey = saveApiKey;
window.handleInputKeydown = handleInputKeydown;
window.adjustTextareaHeight = adjustTextareaHeight;
