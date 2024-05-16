@echo off
echo.
echo [信息] 安装web所有依赖。
echo.

%~d0
cd %~dp0

cd ..
npm install

pause