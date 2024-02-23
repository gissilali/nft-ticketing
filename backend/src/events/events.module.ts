import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';

@Module({
  controllers: [EventsController],
  imports: [TypeOrmModule.forFeature([Event])],
  exports: [TypeOrmModule],
  providers: [JwtService, AuthService, ConfigService, EventsService],
})
export class EventsModule {}
