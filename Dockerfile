FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

COPY .env.example .env

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]
