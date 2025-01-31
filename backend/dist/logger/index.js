"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor() { }
    static getInstance() {
        if (!this.__instance)
            this.__instance = new Logger();
        return this.__instance;
    }
    log(type, data, ...optionalParams) {
        console.log("--------------------------------------");
        console.log(`[${type.toUpperCase()}]     `, data);
        console.log("--------------------------------------");
    }
    info(message, ...optionalParams) {
        this.log("info", message, optionalParams);
    }
    error(message, ...optionalParams) {
        this.log("error", message, optionalParams);
    }
    warn(message, ...optionalParams) {
        this.log("warn", message, optionalParams);
    }
}
Logger.__instance = null;
exports.default = Logger;
