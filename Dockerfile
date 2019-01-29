FROM node:10-alpine

ARG NODE_ENV
ARG PORT

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
