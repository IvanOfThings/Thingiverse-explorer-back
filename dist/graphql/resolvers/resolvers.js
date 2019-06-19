"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../common/logger"));
const baseURL = 'http://localhost:3500/api/v1/';
const resolvers = {
    Query: {
        things: (_source, { kind }, context) => __awaiter(this, void 0, void 0, function* () {
            const { dataSources, Authorization } = context;
            logger_1.default.debug("In the Query linst of things");
            logger_1.default.debug(Authorization);
            return dataSources.thingsDatasource.getList(kind, Authorization);
        }),
        thing: (_source, { id }, context) => __awaiter(this, void 0, void 0, function* () {
            const { dataSources, Authorization } = context;
            logger_1.default.debug("In the Query thing");
            logger_1.default.debug(Authorization);
            return dataSources.thingsDatasource.getThing(id, Authorization);
        }),
    },
    Thing: {
        thing: (_source, { id }, context) => __awaiter(this, void 0, void 0, function* () {
            const { dataSources, Authorization } = context;
            logger_1.default.debug("In the Query thing");
            logger_1.default.debug(Authorization);
            return dataSources.thingsDatasource.getThing(id, Authorization);
        }),
    }
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map