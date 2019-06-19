"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const logger_1 = __importDefault(require("../../common/logger"));
const request_1 = __importDefault(require("request"));
const querystring_1 = __importDefault(require("querystring"));
class ThingsService {
    /**
    * Exchanges the code given by the thingiverse server and the secret for a valid Token.
    * @param  {string} code code given by thingiverse server in the second phase of negotiation
    * @return  {Promise<any>} Promise with the server response.
    */
    getToken(code) {
        const queryString = querystring_1.default.stringify({
            code: code,
            client_id: process.env.THINGIVERSE_CLIENT_ID,
            client_secret: process.env.THINGIVERSE_CLIENTE_SECRET
        });
        let tokenUrl = `https://www.thingiverse.com/login/oauth/access_token?${queryString}`;
        return new bluebird_1.default((resolve, reject) => {
            request_1.default.post((tokenUrl), function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    logger_1.default.error(`Error getting data ${error}`);
                    logger_1.default.error(` Status code ${response.statusCode}`);
                    reject(error);
                }
                else {
                    let bodyParams = querystring_1.default.parse(body);
                    let access_token = bodyParams.access_token[0];
                    resolve({ access_token: bodyParams.access_token });
                }
            });
        });
    }
    /**
    * A new Thing is obtained using the Bearer token given and the if for a Thing at thingiverse.
    * @param  {string} accessToken Bearer Token provided
    * @param  {string} id for the Thing that is wanted to retrive from thingiverse backend
    * @return  {Promise<any>} Promise with the server response.
    */
    getThingFromThingiverse(accessToken, id) {
        logger_1.default.trace(`fetch thing with id ${id}`);
        const options = {
            url: `https://api.thingiverse.com/things/${id}/`,
            headers: { Authorization: `Bearer ${accessToken}` },
            json: true
        };
        return new bluebird_1.default((resolve, reject) => {
            request_1.default.get(options, function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    logger_1.default.error(`Error getting data ${error}`);
                    logger_1.default.error(` Status code ${response.statusCode}`);
                    reject(error);
                }
                resolve(body);
            });
        });
    }
    /**
    * USes the Bearer token given and the property wich by is wanted to sort the result and a list of things from thingiverse are retrieved.
    * @param  {string} accessToken Bearer Token provided
    * @param  {string} property Parameter ask the server in a particular order for the info, it could be one of the following values: ["newest", "popular" or "featured"]
    * @return  {Promise<any>} Promise with the server response.
    */
    getListFromThingiverse(accessToken, property) {
        logger_1.default.trace(`fetch thing list ${property}`);
        if (["newest", "featured", "popular"].includes(property)) {
            const options = {
                url: `https://api.thingiverse.com/${property}/`,
                headers: { Authorization: `Bearer ${accessToken}` },
                json: true
            };
            return new bluebird_1.default((resolve, reject) => {
                request_1.default.get(options, function (error, response, body) {
                    if (error || response.statusCode !== 200) {
                        logger_1.default.error(`Error getting data ${error}`);
                        logger_1.default.error(` Status code ${response.statusCode}`);
                        reject(error);
                    }
                    resolve(body);
                });
            });
        }
        else {
            return new bluebird_1.default(((resolve, reject) => reject("The value for parameter property is not allowed, chose one of: 'newest', 'featured' or 'popular'")));
        }
    }
}
exports.ThingsService = ThingsService;
exports.default = new ThingsService();
//# sourceMappingURL=things.service.js.map