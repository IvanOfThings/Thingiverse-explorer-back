"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const federation_1 = require("@apollo/federation");
const resolvers_1 = __importDefault(require("../graphql/resolvers/resolvers"));
const schemas_1 = __importDefault(require("../graphql/schemas/schemas"));
const things_1 = __importDefault(require("../graphql/datasources/things"));
const openapi_1 = __importDefault(require("./openapi"));
const logger_1 = __importDefault(require("./logger"));
const app = express_1.default();
/**
* Verifies the Bearer token at the incoming requests and returns the Bearer token in format "Bearer <token>"
* @param  {Request} Request received on the server
* @return  {null | string} Token extracted from the Authorization headers or null if it is not found.
*/
function getToken(req) {
    let authorization = null;
    let regexp = /^(Bearer )([a-zA-Z0-9])+$/;
    try {
        authorization = req.headers.authorization ? req.headers.authorization : null;
        if (!authorization || !regexp.test(authorization)) {
            authorization = null;
        }
    }
    catch (err) {
        logger_1.default.error(err);
        authorization = null;
    }
    return authorization;
}
//Apollo Server configuration (schemas, API datasource for resolvers and middelware fot managing the token in Authoriztion header for adding it to the context of the graphql queries)
const server = new apollo_server_express_1.ApolloServer({
    schema: federation_1.buildFederatedSchema([
        {
            typeDefs: schemas_1.default,
            resolvers: resolvers_1.default,
        },
    ]),
    dataSources: () => ({
        thingsDatasource: new things_1.default()
    }),
    context: ({ req }) => ({
        Authorization: getToken(req)
    })
});
class ExpressServer {
    constructor() {
        const root = path_1.default.normalize(__dirname + '/../..');
        app.set('appPath', root + 'client');
        app.use(body_parser_1.default.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
        app.use(body_parser_1.default.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
        app.use(cors_1.default()); //Cross-origin resource sharing middleware
        app.use(cookie_parser_1.default(process.env.SESSION_SECRET));
        app.use(express_1.default.static(`${root}/public`)); // Static content
        server.applyMiddleware({ app, path: '/graphql' }); // Apollos 2.0 middleware fro express
    }
    router(routes) {
        openapi_1.default(app, routes);
        return this;
    }
    listen(p = process.env.PORT) {
        const welcome = port => () => logger_1.default.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os_1.default.hostname()} on port: ${port}}`);
        http_1.default.createServer(app).listen(p, welcome(p));
        return app;
    }
}
exports.default = ExpressServer;
//# sourceMappingURL=server.js.map