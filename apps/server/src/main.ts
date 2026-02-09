import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "@marcahora/env/server";
import { LoggingInterceptor } from "./shared/logging/logging.interceptor";
import { WinstonLogger } from "./shared/logging/winston-logger.service";
import { requestIdMiddleware } from "./shared/logging/request-id.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // middleware de request ID para rastreamento de logs
  app.use(requestIdMiddleware);

  // interceptor global
  const logger = new WinstonLogger();
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // logger global do Nest
  app.useLogger(logger);

  app.enableCors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });

  const portEnv = env.PORT ?? process.env.PORT;
  const port = portEnv ? parseInt(String(portEnv), 10) : 3000;

  await app.listen(port);
  console.log(`Servidor rodando na porta ${port}`);
}

bootstrap();
