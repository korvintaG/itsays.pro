FROM node:23-alpine AS builder2
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27.4-alpine AS production2
RUN apk add mc
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder2 /app/dist /opt/site/
