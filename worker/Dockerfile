FROM node:12.18.1

COPY ["package.json", "package-lock.json*", "workspace/"]
RUN mkdir dist/
COPY ["dist/", "workspace/"]

WORKDIR /workspace

RUN apt-get update
RUN apt-get -y install apt-transport-https ca-certificates curl gnupg2 software-properties-common
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
RUN apt-get update
RUN apt-cache policy docker-ce
RUN apt-get -y install docker-ce

RUN npm install --production
RUN npm run build
RUN mkdir -p work

CMD [ "npm", "start" ]