FROM node:latest

RUN mkdir /src

WORKDIR /src/app
ADD package.json /src/app
RUN npm install

COPY . /src/app

WORKDIR /src/app
RUN npm run prod

EXPOSE 3002

WORKDIR /src/app
CMD npm run serve
