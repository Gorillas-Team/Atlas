FROM node:18-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --immutable

COPY . .
CMD ["yarn", "start"]