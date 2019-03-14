FROM node:11.11.0-alpine

ARG BASE

RUN mkdir -p ${BASE}
COPY . ${BASE}/
WORKDIR ${BASE}

RUN npm install --no-optional