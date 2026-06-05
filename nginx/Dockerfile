# Context - Root directoy .
# stage 1 - react build stage
FROM node:25-alpine AS builder

WORKDIR /app

COPY client/package.json ./
COPY client/package-lock.json ./

RUN npm install

COPY client/ .

RUN npm run build

# stage 2 - Nginx
FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
