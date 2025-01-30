"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const repository_1 = __importDefault(require("../repository/repository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const todoBodyValidation = zod_1.default.object({
    description: zod_1.default.string(),
    title: zod_1.default.string(),
    reminderTime: zod_1.default.date().optional(),
});
class todoMiddleware {
    constructor() {
        this.__repo = repository_1.default.getInstance();
        this.authenticate = this.authenticate.bind(this);
    }
    todoValidation(req, res, next) {
        const body = req.body;
        const check = todoBodyValidation.safeParse(body);
        if (check.success) {
            next();
        }
        else {
            res.status(422).json({ message: "Wrong Input!" });
        }
    }
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                res.status(422).json({ message: "No authorization token was found!" });
                return;
            }
            try {
                const decode = jsonwebtoken_1.default.verify(token, process.env.SECRET || "");
                req.user_id = parseInt(decode.id);
                const user = yield this.__repo.__user.getUserById(req.user_id);
                if (user)
                    next();
                else
                    res.status(500).json({ message: "Wrong user reference!" });
            }
            catch (e) {
                res.status(500).json({ message: e.message });
            }
        });
    }
}
exports.default = todoMiddleware;
