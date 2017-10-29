FROM node:8.6.0

MAINTAINER devfunny-api <admin@devfunny.com>

RUN mkdir -p /app

WORKDIR /app

ADD package.json package-lock.json /app/

RUN npm install

COPY . /app/

EXPOSE 4040

CMD [ "npm", "start" ]
