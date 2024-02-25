import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    maxAge: 1000000,
  });
  app.use(cookieParser('secret'));
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.reduce((errorObject, error) => {
            errorObject[error.property] = Object.values(error.constraints);
            return errorObject;
          }, {}),
        );
      },
    }),
  );
  await app.listen(3000);
}

bootstrap();
