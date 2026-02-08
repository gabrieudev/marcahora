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
      // Reconstrói a URL completa (mesma lógica do Fastify)
      const host = req.headers.host ?? "localhost:3000";
      const url = new URL(req.originalUrl || req.url, `http://${host}`);

      // Constrói Headers (Fetch API)
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

      // Repasse fiel do status e headers
      res.status(response.status);
      response.headers.forEach((value, key) => {
        // evita sobrescrever hop-by-hop headers controlados pelo Express automaticamente, se quiser:
        res.setHeader(key, value);
      });

      // Corpo: envia texto (igual ao seu exemplo original)
      const text = response.body ? await response.text() : null;
      res.send(text);
    } catch (error) {
      console.error("Authentication Error:", error);
      res.status(500).json({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  }
}
