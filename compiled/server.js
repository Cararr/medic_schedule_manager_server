"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server = express_1.default();
const PORT = process.env.port || 4000;
server.get('/', (req, res, next) => {
    res.send('ok');
});
server.listen(PORT, () => {
    console.log(`CArArr on ${PORT}`);
});
