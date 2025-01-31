export default class Logger {
  private static __instance: Logger | null = null;
  private constructor() {}
  static getInstance() {
    if (!this.__instance) this.__instance = new Logger();
    return this.__instance;
  }

  log(type: string, data: any, ...optionalParams: any[]) {
    console.log("--------------------------------------");
    console.log(`[${type.toUpperCase()}]     `, data);
    console.log("--------------------------------------");
  }

  info(message?: any, ...optionalParams: any[]) {
    this.log("info", message, optionalParams);
  }
  error(message?: any, ...optionalParams: any[]) {
    this.log("error", message, optionalParams);
  }
  warn(message?: any, ...optionalParams: any[]) {
    this.log("warn", message, optionalParams);
  }
}
