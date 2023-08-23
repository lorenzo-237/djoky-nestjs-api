import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { SESSION_MAX_AGE, SESSION_NAME } from './utils/constants';
import * as basicAuth from 'express-basic-auth';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import swagger from './swagger';
import redis from './redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const env = app.get(ConfigService);
  const isProduction = env.get('NODE_ENV') === 'production';

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(
    ['/api/docs', '/api/docs-json', '/api/docs-yaml'],
    basicAuth({
      challenge: true,
      users: {
        [env.get('SWAGGER_USER')]: env.get('SWAGGER_PASSWORD'),
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  swagger.initialize(app);

  // Initialize session + store.
  try {
    await redis.initialize(env);
    app.use(
      session({
        name: SESSION_NAME,
        store: redis.getStore(),
        secret: env.get('SESSION_SALT'),
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: SESSION_MAX_AGE,
          httpOnly: true,
          secure: isProduction,
          signed: true,
        },
      }),
    );
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', error);
  }

  app.use(passport.initialize());
  app.use(passport.session());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(parseInt(env.get<string>('APP_PORT')));
}
bootstrap();
