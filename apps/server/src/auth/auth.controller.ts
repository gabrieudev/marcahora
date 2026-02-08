import { Controller, All, Req, Res } from "@nestjs/common";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { auth } from "@marcahora/auth";

@Controller("api/auth")
export class AuthController {
  @All("*")
  async handleAuth(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    try {
      // Reconstrói a URL completa
      const host = req.headers.host ?? "localhost:3000";
      const url = new URL(req.originalUrl || req.url, `http://${host}`);

      // Constrói Headers
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (!value) return;
        const str = Array.isArray(value) ? value.join(",") : String(value);
        headers.append(key, str);
      });

      // Body: só envia se existir
      const methodHasBody = ["POST", "PUT", "PATCH", "DELETE"].includes(
        req.method.toUpperCase(),
      );
      const body =
        methodHasBody && req.body && Object.keys(req.body).length > 0
          ? typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body)
          : undefined;

      const fetchRequest = new Request(url.toString(), {
        method: req.method,
        headers,
        body,
      });

      const response = await auth.handler(fetchRequest);

      // status
      res.status(response.status);

      // headers: filtrar hop-by-hop, preservar múltiplos Set-Cookie
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

      // enviar corpo
      if (response.body) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // opcional: set content-length
        res.setHeader("Content-Length", String(buffer.length));
        res.send(buffer);
      } else {
        res.sendStatus(response.status);
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
