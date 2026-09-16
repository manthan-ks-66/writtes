# Context - Root directoy .
# stage 1 - react build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY Frontend/package*.json ./

RUN npm install

COPY Frontend/ .

RUN npm run build

# stage 2 - Nginx
FROM nginx:alpine

COPY Application/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
