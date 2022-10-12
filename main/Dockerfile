FROM node:lts-slim

RUN apt-get update
RUN apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

WORKDIR /front-main

# to execute in .. context
COPY . .

ARG NODE_ENV
ARG VUE_APP_API_URL
ARG VUE_APP_CAPTCHA_SITE_KEY
ARG VUE_APP_DOCS_URL
ARG VUE_APP_FC_LOGOUT_URL
ARG VUE_APP_FRANCE_CONNECT_LOGIN_URL
ARG VUE_APP_FULL_TENANT_URL
ARG VUE_APP_MAIN_URL
ARG VUE_APP_MATOMO_SITE_ID
ARG VUE_APP_MATOMO_URL
ARG VUE_APP_OWNER_URL
ARG VUE_APP_REGISTER_URL
ARG VUE_APP_SSO_CLIENT_ID
ARG VUE_APP_SSO_ENDPOINT
ARG VUE_APP_TENANT_URL

RUN env

WORKDIR /front-main/main

RUN yarn install

RUN yarn build

EXPOSE 8080
ENV PORT 8080

CMD [ "node", "server.js" ]
