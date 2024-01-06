FROM node:20.7
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.* ./
COPY yarn.lock ./

RUN npm install

COPY . .

RUN yarn run build

EXPOSE 4000

CMD ["node", "dist/src/main"]
