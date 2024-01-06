# Mobile & Web app that allows players to arrange tournaments to pick the winners

Project structure:

- [API](#the-api)
- [Frontend](#frontend)

## Features

The API includes **e2e** tests, they run each time developer
push code or make pull request, you can find the tests
[./server/test/e2e](./server/test/e2e), also see GitHub Actions
workflow which runs the tests [./.github/workflows/](./.github/workflows/)

To monitor code quality we use ESLint and Prettier, before
start to contribute set up your IDE to use ESLint and
Prettier.

## The API

The API have such modules:

- admin - Admin panel
- analytics - Analytics for admin panel
- auth - Authentication & Authorization logic
- mail - Mail sender
- tournaments - Tournaments logic
- user - User functionality


The API runs on port `4000`

The API has a CORS policy, it includes:

- frontend URL: [`http://localhost:8000`](http://localhost:8000)
- later we'll set up production URL

There is a **Swagger** documentation, to get access to that
you need to run the API and open this URL: [http://localhost:4000/docs](http://localhost:4000/docs)

## Frontend

The Frontend runs on the port `8000`

[//]: # (// TODO write Frontend documentation)

## Local run

Requirements:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com/)

Run Docker (MongoDB database):

```shell
docker-compose up -d
```

Install packages for both the API and the client:

```shell
cd client
yarn install
cd ../server
yarn install
```

Run the API:

```shell
cd server
yarn start:dev
```

Run frontend:

```shell
cd client
yarn start
```
