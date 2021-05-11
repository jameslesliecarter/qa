# syntax=docker/dockerfile:1

FROM node:14

ENV NODE_ENV=production

WORKDIR /

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "start.js"]

