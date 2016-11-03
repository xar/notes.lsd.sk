FROM node:latest

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src/app
ADD package.json /src/app
RUN npm install

COPY . /src/app

RUN npm run build

WORKDIR /src/app/server

RUN npm install

EXPOSE 3001

WORKDIR /src/app

CMD npm run server
