git push github-origin
git push bitbucket-origin
npx pm2 delete all

Last Updated running branch in QA: mainLiveV6



forever in remote server:
forever start startServer.js -> Start a script
forever list -> View running processes
forever stopall -> Stop all running processes
forever stop [index|script] -> Stop a specific process
sudo lsof -i :6000
sudo kill -9 [PID]
forever restart [index|script] -> Restart a specific process
forever logs [index|script]
forever --watch start startServer.js -> auto-restarts on file change
forever start -c "node --inspect" startServer.js -> Run a script in the foreground (debugging)