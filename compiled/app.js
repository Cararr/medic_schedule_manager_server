"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const express_1 = __importDefault(require("express"));
const server = express_1.default();
const PORT = process.env.PORT || 4000;
const routing_controllers_2 = require("routing-controllers");
let testController = class testController {
    testResponse() {
        return '<h1>DUPCA</h1>';
    }
};
__decorate([
    routing_controllers_2.Get('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], testController.prototype, "testResponse", null);
testController = __decorate([
    routing_controllers_2.Controller()
], testController);
const app = routing_controllers_1.createExpressServer({ controllers: [testController] });
app.listen(PORT);
/* server.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('okrr');
});

server.listen(PORT, () => {
    console.log(`CArArr on ${PORT}`);
}); */
