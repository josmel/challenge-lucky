import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Transaction Doc')
    .setDescription('Transaction Doc')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api/v1', app, document, {
    swaggerOptions: {
      useBasicAuthenticationWithAccessCodeGrant: true, // Permite enviar el token de autorización en las solicitudes
    },
  });
}

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
