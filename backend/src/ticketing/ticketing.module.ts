import { Module } from '@nestjs/common';
import { TicketingController } from './ticketing.controller';
import { TicketingService } from './ticketing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from './ticket.entity';
import { EventEntity } from '../events/event.entity';
import { UnlockService } from '../events/unlock.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, EventEntity])],
  controllers: [TicketingController],
  providers: [TicketingService, UnlockService],
})
export class TicketingModule {}
