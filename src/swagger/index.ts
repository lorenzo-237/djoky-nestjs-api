import { INestApplication } from '@nestjs/common';
import createApiDoc from './create-api-doc';
import createApiExtDoc from './create-api-ext-doc';

class MySwagger {
  initialize(app: INestApplication<any>) {
    createApiDoc(app, 'api/docs');
    createApiExtDoc(app, 'api/edocs');
  }

  protectedURL(): string[] {
    return ['/api/docs', '/api/docs-json', '/api/docs-yaml'];
  }
}

export default new MySwagger();
