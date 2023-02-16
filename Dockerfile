FROM node:18.6-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE ${PORT}

RUN npm run build

RUN npm run migration:generate

CMD  ["npm", "run", "start:dev"]
