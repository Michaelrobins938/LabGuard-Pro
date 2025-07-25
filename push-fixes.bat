@echo off
echo Pushing fixes to trigger Vercel deployment...
git add .
git commit -m "Trigger deployment with latest fixes"
git push origin main
echo Done! Vercel should now deploy.
pause 