FROM node:16-bullseye-slim as build-stage

WORKDIR /front-main

COPY . .

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

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

WORKDIR /front-main/main
RUN yarn install
RUN yarn build --mode non-prod

# -----------------------------------------------

FROM node:16-bullseye-slim as deploy-stage

WORKDIR /front-main

COPY --from=build-stage /front-main/main/dist ./dist
COPY --from=build-stage /front-main/main/node_modules ./node_modules
COPY --from=build-stage /front-main/main/server.js ./

EXPOSE 8080
ENV PORT 8080

CMD [ "node", "server.js" ]
