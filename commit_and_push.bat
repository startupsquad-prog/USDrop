@echo off
echo Adding all changes...
git add .

echo Committing changes...
git commit -m "Fix React Router imports for Vercel build compatibility"

echo Pushing to GitHub...
git push origin main

echo Done! Changes have been pushed to GitHub.
pause
