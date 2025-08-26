@echo off
chcp 65001 > nul
title 小奕畅聊本地部署

echo.
echo 🏠 小奕畅聊本地部署脚本
echo =========================

REM 检查端口
set PORT=8000

:checkport
netstat -an | findstr :%PORT% > nul
if %errorlevel%==0 (
    echo ⚠️  端口 %PORT% 已被占用，尝试端口 %PORT%+1
    set /a PORT+=1
    goto checkport
)

echo 🌐 使用端口: %PORT%

REM 获取本机IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 地址" ^| findstr /v "127.0.0.1"') do (
    for /f "tokens=1" %%b in ("%%a") do set LOCAL_IP=%%b
)

if "%LOCAL_IP%"=="" (
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address" ^| findstr /v "127.0.0.1"') do (
        for /f "tokens=1" %%b in ("%%a") do set LOCAL_IP=%%b
    )
)

echo 💻 本机IP地址: %LOCAL_IP%
echo.
echo 🚀 启动本地服务器...
echo.
echo 📍 本地访问地址:
echo    http://localhost:%PORT%
echo    http://127.0.0.1:%PORT%
echo.
echo 🌐 局域网访问地址:
echo    http://%LOCAL_IP%:%PORT%
echo.
echo 📋 分享给其他人:
echo    同一WiFi网络下的用户可以访问: http://%LOCAL_IP%:%PORT%
echo.
echo 🔗 想要外网访问？
echo    1. 安装 ngrok: https://ngrok.com/
echo    2. 运行: ngrok http %PORT%
echo    3. 或使用 localtunnel: npx localtunnel --port %PORT%
echo.
echo ⏹️  按 Ctrl+C 停止服务
echo =========================
echo.

REM 尝试启动Python服务器
python -c "import sys; print(sys.version)" > nul 2>&1
if %errorlevel%==0 (
    echo 使用 Python 启动服务器...
    python -m http.server %PORT% --bind 0.0.0.0
    goto end
)

python3 -c "import sys; print(sys.version)" > nul 2>&1
if %errorlevel%==0 (
    echo 使用 Python3 启动服务器...
    python3 -m http.server %PORT% --bind 0.0.0.0
    goto end
)

REM 尝试Node.js
node --version > nul 2>&1
if %errorlevel%==0 (
    echo 使用 Node.js serve 启动服务器...
    npx serve . -l %PORT%
    goto end
)

echo ❌ 需要安装Python或Node.js来运行本地服务器
echo.
echo 安装方法：
echo Python: https://python.org
echo Node.js: https://nodejs.org
pause

:end

