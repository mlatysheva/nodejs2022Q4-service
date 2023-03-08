FROM node:18.6-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE ${PORT}

CMD  ["npm", "run", "start:dev"]
