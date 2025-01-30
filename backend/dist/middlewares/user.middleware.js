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
const userSignupSchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
});
const userSigninSchema = userSignupSchema.omit({ name: true });
class userMiddleware {
    constructor() {
        this.__repo = repository_1.default.getInstance();
        this.singupMiddleware = this.singupMiddleware.bind(this);
        this.signinValidation = this.signinValidation.bind(this);
    }
    signupValidation(req, res, next) {
        const data = req.body;
        console.log(data);
        const check = userSignupSchema.safeParse(data);
        console.log(check.success ? "Passed validation" : "Failed validation");
        if (check.success) {
            next();
            return;
        }
        res.status(422).json({ message: "Wrong Inputs" });
    }
    signinValidation(req, res, next) {
        const data = req.body;
        const check = userSigninSchema.safeParse(data);
        if (check.success) {
            next();
            return;
        }
        res.status(422).json({ message: "Wrong Inputs" });
    }
    singupMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield this.__repo.__user.getUserByEmail(email);
            if (!user) {
                console.log("Here right now, user not found");
                next();
                return;
            }
            else {
                res
                    .status(500)
                    .json({ message: "User already exist with your mentioned email!" });
            }
        });
    }
}
exports.default = userMiddleware;
