import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Web3Module } from 'nest-web3';
import { AuthService } from './auth/auth.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';

@Module({
  imports: [
    EventsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('APP_KEY'),
      }),
      inject: [ConfigService],
    }),
    Web3Module.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('WEB3_URL'),
        name: 'eth',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Event],
        synchronize: true,
        migrations: ['dist/migrations/*.js'],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
