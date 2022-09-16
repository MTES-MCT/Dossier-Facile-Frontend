FROM node:lts-slim

RUN npm install -g http-server

RUN apt-get update
RUN apt-get install -yyq ca-certificates

# Puppeter doesn't work properly on docker
ENV NODE_ENV preprod

WORKDIR /front-tenant

COPY .. ./

RUN yarn tenant install

WORKDIR /front-tenant/tenant

RUN yarn build

EXPOSE 8080

CMD [ "http-server", "/front-tenant/tenant/dist" ]
