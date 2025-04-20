git push github-origin
git push bitbucket-origin
npx pm2 delete all

Last Updated running branch in QA: mainLiveV6


aws serverless deployment
sls deploy
(Already imported aws scrent and key)
update will happen based on serverless.yaml file

sls deploy
Output:
Deploying nse-india-tracker to stage dev (ap-south-1)

✔ Service deployed to stack nse-india-tracker-dev (187s)

functions:
  fetchData: nse-india-tracker-dev-fetchData (28 MB)

Serverless Framework V4 is now available.
- Learn more in our README: https://github.com/serverless/serverless
- Run "npm i serverless -g" to update
