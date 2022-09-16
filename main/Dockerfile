FROM node:lts-slim

RUN npm install -g http-server

RUN apt-get update
RUN apt-get install -yyq ca-certificates

# Puppeter doesn't work properly on docker
ENV NODE_ENV dev

WORKDIR /front-main

COPY .. ./

RUN yarn main install

RUN cd main && yarn build

EXPOSE 3000
CMD [ "http-server", "main/dist" ]