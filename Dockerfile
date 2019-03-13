FROM node:11.11.0-alpine

RUN rm -rf CWD/node_modules

ADD ./src CWD
ADD ./logs CWD
ADD ./data CWD

ADD ./package.json CWD
ADD ./package-lock.json CWD
ADD ./tsconfig.json CWD

WORKDIR CWD

EXPOSE PORT

RUN npm prune
RUN npm install
