import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import apiModules from 'src/modules/api-modules';

export default function createApiDoc(app: INestApplication<any>, url: string) {
  const mainApiOption = new DocumentBuilder()
    .setTitle('My authentication API')
    .setDescription('Cool description')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const mainDocument = SwaggerModule.createDocument(app, mainApiOption, {
    include: apiModules,
  });
  SwaggerModule.setup(url, app, mainDocument);
}
