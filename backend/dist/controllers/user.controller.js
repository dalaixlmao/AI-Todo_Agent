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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const repository_1 = __importDefault(require("../repository/repository"));
const bcrypt_1 = require("bcrypt");
class userController {
    constructor() {
        this.__repo = repository_1.default.getInstance();
        this.createUser = this.createUser.bind(this);
        this.signIn = this.signIn.bind(this);
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
                const user = yield this.__repo.__user.createUser(name, email, hashedPassword);
                const id = user.id;
                const token = "Bearer " + jsonwebtoken_1.default.sign({ id }, process.env.SECRET || "");
                res.status(200).json({ message: "User signed up successfully", token });
            }
            catch (e) {
                res.status(500).json({ message: e.message });
            }
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
                const user = yield this.__repo.__user.getUserByEmail(email);
                const check = yield (0, bcrypt_1.compare)(password, hashedPassword);
                if (!check) {
                    res.status(403).json({ message: "Wrong password!" });
                    return;
                }
                const id = user === null || user === void 0 ? void 0 : user.id;
                const token = "Bearer " + jsonwebtoken_1.default.sign({ id }, process.env.SECRET || "");
                res.status(200).json({ message: "User signed in successfully", token });
            }
            catch (e) {
                res.status(500).json({ message: e.message });
            }
        });
    }
}
exports.default = userController;
