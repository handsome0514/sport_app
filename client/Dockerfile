#FROM node:18 as build
#
#WORKDIR /urc/src/app
#
#COPY package.json ./
#
#COPY yarn.lock ./
#
#RUN yarn
#
#COPY . .
#
#RUN npm run build
#
#FROM --platform=linux/amd64 node:18 AS production
#
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
#
#WORKDIR /usr/src/app
#
#RUN yarn install --production=true
#
#COPY .env .
#
#COPY node_modules ./node_modules
#
##COPY --from=build /usr/src/app/dist ./dist
#
#EXPOSE 3000
#
#CMD ["yarn", "start"]
ARG BUILD_IMAGE="node:19"
ARG RUN_IMAGE="nginx:alpine"
#FROM --platform=linux/amd64 node:18
FROM $BUILD_IMAGE as build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
#ARG API_URL=https://subsoccer-staging-server-pnl2gmkxja-lz.a.run.app
#ENV API_URL=${API_URL}
#ENV SOCKET_URL=${API_URL}
#ENV REACT_APP_API_URL=${API_URL}
#ENV REACT_APP_SOCKET_URL=${API_URL}
ARG REACT_APP_API_URL

WORKDIR /app

COPY package.json yarn.lock ./

RUN echo "Print out REACT_APP_API_URL=$REACT_APP_API_URL"

RUN yarn install

COPY . .

RUN yarn build

FROM $RUN_IMAGE AS runner

COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/templates/default.conf.template

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN echo "Later build: REACT_APP_API_URL=$REACT_APP_API_URL"
CMD ["nginx", "-g", "daemon off;"]

