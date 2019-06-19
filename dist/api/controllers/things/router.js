"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
exports.default = express_1.default.Router()
    .get('/callback', controller_1.default.callback)
    .get('/things/:id', controller_1.default.getThing)
    .get('/list/:property', controller_1.default.getList);
//# sourceMappingURL=router.js.map