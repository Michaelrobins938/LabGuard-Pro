# Fix deployment script - Switch to master branch and apply our fixes
Write-Host "Switching to master branch..."
git checkout master

Write-Host "Merging fixes from main branch..."
git merge main

Write-Host "Pushing to master branch..."
git push origin master

Write-Host "Done! Vercel should now deploy from master branch with our fixes." 