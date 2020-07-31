FROM node:14-alpine

WORKDIR /usr/local/atlas

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .
CMD ["yarn", "start"]