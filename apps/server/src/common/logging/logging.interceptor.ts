import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
  type LoggerService,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startedAt = Date.now();
    const http = context.switchToHttp();

    const req = http.getRequest();
    const res = http.getResponse();

    const { method, url } = req;
    const requestId = req.id || req.headers["x-request-id"];
    const userId = req.user?.id;

    const safeBody = this.sanitize(req.body);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startedAt;

        this.logger.log("HTTP Request", {
          context: "HTTP",
          method,
          url,
          status: res.statusCode,
          duration: `${duration}ms`,
          requestId,
          userId,
          body: safeBody,
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startedAt;

        this.logger.error("HTTP Error", error.stack, {
          context: "HTTP",
          method,
          url,
          status: res.statusCode,
          duration: `${duration}ms`,
          requestId,
          userId,
          error: error.message,
        });

        throw error;
      }),
    );
  }

  private sanitize(body: any) {
    if (!body || typeof body !== "object") return body;

    const SENSITIVE_KEYS = ["password", "token", "refreshToken"];

    return Object.fromEntries(
      Object.entries(body).map(([key, value]) => [
        key,
        SENSITIVE_KEYS.includes(key) ? "[REDACTED]" : value,
      ]),
    );
  }
}
