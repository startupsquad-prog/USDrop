@echo off
echo Fixing TypeScript errors and pushing to GitHub...

echo Adding all changes...
git add .

echo Committing TypeScript fixes...
git commit -m "Fix TypeScript errors: remove unused Button import and add null check for product ID"

echo Pushing to GitHub...
git push origin main

echo Done! TypeScript errors have been fixed and changes pushed to GitHub.
echo Vercel should now build successfully.
pause
