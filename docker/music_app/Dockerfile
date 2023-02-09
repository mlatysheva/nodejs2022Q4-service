FROM node:lts-alpine
# FROM --platform=linux/amd64 node:18-alpine

RUN mkdir -p /usr/app
# Create app directory
WORKDIR /usr/app

RUN npm prune --production

COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

COPY .env.example .env

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]
