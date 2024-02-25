import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { UnlockService } from './unlock.service';
import { EventsService } from './events.service';

@Module({
  controllers: [EventsController],
  imports: [TypeOrmModule.forFeature([EventEntity])],
  exports: [TypeOrmModule],
  providers: [
    JwtService,
    AuthService,
    ConfigService,
    EventsService,
    UnlockService,
  ],
})
export class EventsModule {}
