"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const things_service_1 = __importDefault(require("../../services/things.service"));
const querystring_1 = __importDefault(require("querystring"));
const logger_1 = __importDefault(require("../../../common/logger"));
class Controller {
    /**
    * A new Thing is obtained using the Bearer token given and the if for a Thing at thingiverse.
    * @param  {Request} req Request received, shoud have a code as query parameter
    * @param  {Response} res Response that will be sent back to the client.
    */
    getThing(req, res) {
        try {
            const { access_token } = req.query;
            const { property } = req.params;
            logger_1.default.debug('Getting Thing ');
            const thing = things_service_1.default.getThingFromThingiverse(access_token, req.params.id);
            thing.then(r => {
                if (r) {
                    logger_1.default.debug('Newest thing obtained: ', thing);
                    res.json(r);
                }
                else
                    res.json({ errors: [{ message: "Resource not found" }] }).status(404).end();
            }).catch((error) => {
                logger_1.default.error('Error ocurred obtaining a thing : ', error);
                return res.json({ errors: [{ message: "Resource not found" }] }).status(404).end();
            });
        }
        catch (error) {
            logger_1.default.error('Error ocurred obtaining a thing : ', error);
            return res.json({ errors: [{ message: error }] }).status(500).end();
        }
    }
    /**
    * USes the Bearer token given and the property wich by is wanted to sort the result and a list of things from thingiverse are retrieved.
    * @param  {Request} req Request received, shoud have a code as query parameter
    * @param  {Response} res Response that will be sent back to the client.
    */
    getList(req, res) {
        try {
            const { access_token } = req.query;
            const { property } = req.params;
            logger_1.default.debug('Getting List ');
            const thingsList = things_service_1.default.getListFromThingiverse(access_token, property);
            thingsList.then(r => {
                let promiseList = r.map((item) => {
                    return things_service_1.default.getThingFromThingiverse(access_token, item.id);
                });
                Promise.all(promiseList).then(r => {
                    logger_1.default.debug('All promises fhinished');
                    res.json(r).status(200).end();
                }).catch((error) => {
                    logger_1.default.error('Something went wrong : ', error);
                    return res.json({ errors: [{ message: "Resource not found" }] }).status(404).end();
                });
            }).catch((error) => {
                logger_1.default.error('Error ocurred obtaining a thing : ', error);
                return res.status(400).json({ errors: [{ message: error }] }).end();
            });
        }
        catch (error) {
            logger_1.default.error('Something went wrong: ', error);
            return res.json({ errors: [{ message: error }] }).status(500).end();
        }
    }
    /**
    * Exchanges the code given by the thingiverse server and the secret for a valid Token.
    * @param  {Request} req Request received, shoud have a code as query parameter
    * @param  {Response} res Response that will be sent back to the client.
    */
    callback(req, res) {
        const { code } = req.query;
        if (code) {
            const newest = things_service_1.default.getToken(code);
            logger_1.default.debug('Gettin Token ');
            newest.then((data) => {
                let { access_token } = data;
                res.cookie("access_token", access_token);
                const queryString = querystring_1.default.stringify({
                    access_token: access_token
                });
                return res.json({ access_token: access_token }).status(200);
            });
        }
    }
}
exports.Controller = Controller;
exports.default = new Controller();
//# sourceMappingURL=controller.js.map