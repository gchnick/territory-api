import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from "@nestjs/swagger";

import { AppModule } from "@/app/app.module";

import Logger from "@/shared/domain/logger";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Service Overseer Backend")
    .setDescription("API to application of Service Overseer")
    .setVersion("2.0")
    .build();

  const options: SwaggerCustomOptions = {
    useGlobalPrefix: true,
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, options);

  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT", "3000");

  await app.listen(port, "0.0.0.0");

  const logger = app.get(Logger);
  logger.log(`App is ready and listening on port ${port} 🚀`, "Nest");
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on("uncaughtException", handleError);
