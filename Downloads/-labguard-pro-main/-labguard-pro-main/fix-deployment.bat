@echo off
echo Switching to master branch...
git checkout master

echo Merging fixes from main branch...
git merge main

echo Pushing to master branch...
git push origin master

echo Done! Vercel should now deploy from master branch with our fixes.
pause 