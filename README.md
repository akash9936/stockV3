git push github-origin
git push bitbucket-origin
npx pm2 delete all

Last Updated running branch in QA: mainLiveV4


Docker : mainlive7 is image name. 
Below is in order of if code changes are found
docker build -t mainlive7 .  -> build your image
docker stop <container-id> -> Stop a Running Container
docker rm <container-id> -> Remove a Stopped Container
docker run -p 3000:3000 mainlive7 -> start new container

docker ps -> Check Running Docker Containers
docker ps -a -> List All Containers (Running + Stopped)
docker images -> List All Images:
docker rmi <image-id> -> Remove an Image
docker pull <image-name> -> Pull an Image from Docker Hub
docker tag <existing-image> <new-name:tag> -> Tag an Image
docker ps -a -> Run a Container

docker restart <container-id> -> Restart a Container

docker logs <container-id> -> View Container Logs

