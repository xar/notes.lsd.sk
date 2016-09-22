FROM rethinkdb/horizon

ADD package.json /usr/app

WORKDIR /usr/app

RUN npm install

RUN npm i -g webpack webpack-dev-server

COPY . /usr/app

WORKDIR /usr/app
RUN npm run build

EXPOSE 3002

WORKDIR /usr/app
