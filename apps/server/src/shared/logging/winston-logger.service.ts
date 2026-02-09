import type { LoggerService } from "@nestjs/common";
import * as winston from "winston";
import { prettyFormat } from "./winston.format";

const isProd = process.env.NODE_ENV === "production";

export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: isProd ? "info" : "debug",
      format: isProd
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          )
        : prettyFormat,
      transports: [new winston.transports.Console()],
    });
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, { context });
  }
}
