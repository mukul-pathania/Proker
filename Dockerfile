FROM node:12-alpine

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY . /usr/src/bot
RUN npm ci


CMD ["node", "proker.js"]
