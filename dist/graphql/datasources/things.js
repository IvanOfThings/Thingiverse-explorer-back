"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
class thingsDatasource extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
        this.baseURL = "http://localhost:3500/api/v1/things";
    }
    getToken(auth) {
        let partsAuth = auth.split(" ");
        let token = partsAuth[partsAuth.length - 1];
        return token;
    }
    getList(kind, authorization) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`/list/${kind}?access_token=${this.getToken(authorization)}`);
        });
    }
    getThing(id, authorization) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`/things/${id}?access_token=${this.getToken(authorization)}`);
        });
    }
}
exports.default = thingsDatasource;
//# sourceMappingURL=things.js.map