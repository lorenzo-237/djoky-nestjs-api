import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import extModules from 'src/modules/ext-modules';

export default function createApiExtDoc(
  app: INestApplication<any>,
  url: string,
) {
  const extApiOption = new DocumentBuilder()
    .setTitle('My authentication API')
    .setDescription('Cool description')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const extDocument = SwaggerModule.createDocument(app, extApiOption, {
    include: extModules,
  });
  SwaggerModule.setup(url, app, extDocument);
}
