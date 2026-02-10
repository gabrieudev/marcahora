import { Controller, All, Req, Res } from "@nestjs/common";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { auth } from "@marcahora/auth";

@Controller("api/auth")
export class AuthController {
  @All("*path")
  async handleAuth(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    try {
      const proto =
        (req.headers["x-forwarded-proto"] as string) ?? req.protocol ?? "http";
      const host =
        (req.headers["x-forwarded-host"] as string) ??
        req.headers.host ??
        "localhost:3000";

      const url = new URL(req.originalUrl || req.url, `${proto}://${host}`);

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (!value) continue;
        const str = Array.isArray(value) ? value.join(",") : String(value);
        headers.set(key, str);
      }

      const method = req.method.toUpperCase();
      const methodHasBody = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

      const body =
        methodHasBody && req.body && Object.keys(req.body).length > 0
          ? typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body)
          : undefined;

      const fetchRequest = new Request(url.toString(), {
        method,
        headers,
        body,
        redirect: "manual",
      });

      const response = await auth.handler(fetchRequest);

      res.status(response.status);

      const HOP_BY_HOP = new Set([
        "transfer-encoding",
        "connection",
        "keep-alive",
        "proxy-authenticate",
        "proxy-authorization",
        "te",
        "trailer",
        "upgrade",
        "content-length",
      ]);

      response.headers.forEach((value, key) => {
        const lower = key.toLowerCase();
        if (HOP_BY_HOP.has(lower)) return;

        if (lower === "set-cookie") {
          res.append("Set-Cookie", value);
        } else {
          res.setHeader(key, value);
        }
      });

      if (response.body) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.setHeader("Content-Length", String(buffer.length));
        res.send(buffer);
      } else {
        res.end();
      }
    } catch (error) {
      console.error("Authentication Error:", error);
      res.status(500).json({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  }
}
