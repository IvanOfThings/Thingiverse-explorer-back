# Thigiverse explorer Backend

This service is for its use as the Thingiverse explorer App backend

## Quick Start

Get started developing...

```shell
# install deps
npm install

# run in development mode
npm run dev

```
---

Lets explore the API: http://localhost:3500/api-explorer/


## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm install
```

## Run It
#### Run in *development* mode:
Runs the application is development mode. Should not be used in production

```shell
npm run dev
```

or debug it

```shell
npm run dev:debug
```

#### Run in *production* mode:

Compiles the application and starts it in production production mode.

```shell
npm run compile
npm start
```

## Test It

Run the Mocha unit tests (At this time tests are not included because of the aim of the application)

```shell
npm test
```

or debug them

```shell
npm run test:debug
```

## Try It
* Open you're browser to [http://localhost:3500](http://localhost:3500)
* Invoke the `/things` endpoint 
  ```shell
  curl http://localhost:3500/api/v1/things/list/newest
  ```


## Debug It

#### Debug the server:

```
npm run dev:debug
```

#### Acknowledgement

This project is based on generator-express-no-stress, thanks to Carmine DiMascio (https://github.com/cdimascio/).
