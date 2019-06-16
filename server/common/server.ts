import express from 'express';
import { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildFederatedSchema } from '@apollo/federation';
import resolvers from '../graphql/resolvers/resolvers';
import typeDefs from '../graphql/schemas/schemas';
import thingsDatasource from '../graphql/datasources/things'
import installValidator from './openapi';
import { Request } from 'express';

import l from './logger';

const app = express();

/**
* Verifies the Bearer token at the incoming requests and returns the Bearer token in format "Bearer <token>" 
* @param  {Request} Request received on the server
* @return  {null | string} Token extracted from the Authorization headers or null if it is not found.
*/
function getToken(req: Request): null | string {
  let authorization: null | string = null;
  let regexp: RegExp = /^(Bearer )([a-zA-Z0-9])+$/;
  try {
    authorization = req.headers.authorization ? req.headers.authorization : null;
    if (!authorization || !regexp.test(authorization)) {
      authorization = null;
    }
  } catch (err) {
    l.error(err);
    authorization = null;
  }
  return authorization;
}


//Apollo Server configuration (schemas, API datasource for resolvers and middelware fot managing the token in Authoriztion header for adding it to the context of the graphql queries)
const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  dataSources: () => ({
    thingsDatasource: new thingsDatasource()
  }),
  context: ({ req }) => ({
    Authorization: getToken(req)
  })
});


export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(cors()); //Cross-origin resource sharing middleware
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`)); // Static content
    server.applyMiddleware({ app, path: '/graphql' }); // Apollos 2.0 middleware fro express
  }

  router(routes: (app: Application) => void): ExpressServer {
    installValidator(app, routes)
    return this;
  }

  listen(p: string | number = process.env.PORT): Application {
    const welcome = port => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}`);
    http.createServer(app).listen(p, welcome(p));
    return app;
  }
}
