FROM node:25-alpine

WORKDIR /client

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm build
