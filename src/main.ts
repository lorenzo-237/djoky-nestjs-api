import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PREFIX,
  SESSION_MAX_AGE,
  SESSION_NAME,
} from './utils/constants';
import * as basicAuth from 'express-basic-auth';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExtModule } from './ext/ext.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { CategoriesModule } from './categories/categories.module';
import { ExercisesModule } from './exercises/exercises.module';
import { GroupsModule } from './groups/groups.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const env = app.get(ConfigService);

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

  const mainApiOption = new DocumentBuilder()
    .setTitle('My authentication API')
    .setDescription('Cool description')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const mainDocument = SwaggerModule.createDocument(app, mainApiOption, {
    include: [
      AuthModule,
      UsersModule,
      WorkoutsModule,
      ExercisesModule,
      GroupsModule,
      CategoriesModule,
    ],
  });
  SwaggerModule.setup('api/docs', app, mainDocument);

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
    include: [AuthModule, ExtModule],
  });
  SwaggerModule.setup('api/edocs', app, extDocument);

  // Initialize client.
  const redisHost = REDIS_HOST(env);
  const redisPort = REDIS_PORT(env);
  const redisPrefix = REDIS_PREFIX(env);

  const redisClient = createClient({
    socket: {
      host: redisHost,
      port: redisPort,
    },
  });

  try {
    await redisClient.connect();
    console.log(
      `[SESSION] Connected to redis [${redisHost}:${redisPort}] Prefix is ${redisPrefix}`,
    );
  } catch (err) {
    console.error(err);
  }

  app.use(
    session({
      name: SESSION_NAME,
      store: new RedisStore({
        client: redisClient,
        prefix: `${redisPrefix}:`,
      }),
      secret: env.get('SESSION_SALT'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: SESSION_MAX_AGE,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(parseInt(env.get<string>('APP_PORT')));
}
bootstrap();
