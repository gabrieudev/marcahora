import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "@marcahora/env/server";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
