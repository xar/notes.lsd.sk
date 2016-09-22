FROM rethinkdb/horizon


ADD package.json /usr/app
RUN npm install

COPY . /usr/app

WORKDIR /usr/app
RUN npm run build

EXPOSE 3002

WORKDIR /usr/app
