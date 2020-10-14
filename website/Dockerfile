FROM node:12.18.1

COPY ["package.json", "package-lock.json*", "workspace/"]

WORKDIR /workspace

RUN npm install --production
RUN mkdir -p work

CMD [ "npm", "start" ]