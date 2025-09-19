@echo off
cd /d "C:\Users\MSI\Downloads\Crm\Crm\USDrop"

REM Remove existing git history to start fresh
if exist .git rmdir /s /q .git

REM Initialize new git repository
git init --initial-branch=main

REM Add all files
git add .

REM Make initial commit
git commit -m "Initial commit - USDrop project"

REM Add remote origin
git remote add origin https://github.com/startupsquad-prog/USDrop.git

REM Push to GitHub
git push -u origin main

echo "Successfully pushed to GitHub!"
pause
