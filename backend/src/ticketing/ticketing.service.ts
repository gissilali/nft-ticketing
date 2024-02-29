import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from './ticket.entity';
import { Repository } from 'typeorm';
import { EventEntity } from '../events/event.entity';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateTicketDto } from './ticket.dto';

@Injectable()
export class TicketingService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketsRepository: Repository<TicketEntity>,
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
  ) {}

  async create(eventId: number, ticket: CreateTicketDto) {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
      },
    });

    return await this.ticketsRepository.save({
      eventId: event.id,
      attendeeAddress: ticket.attendeeAddress.toLowerCase(),
      ticketPrice: ticket.ticketPrice,
      transactionHash: ticket.transactionHash,
      organizer: event.organizer,
    });
  }

  async findAll(options?: FindManyOptions<TicketEntity>) {
    let defaultOption: FindManyOptions<TicketEntity> = {
      order: {
        createdAt: 'DESC',
      },
      relations: {
        event: true,
      },
    };
    defaultOption = { ...defaultOption, ...options };
    return await this.ticketsRepository.find(defaultOption);
  }

  async update(id: number, fields: QueryDeepPartialEntity<TicketEntity>) {
    return await this.ticketsRepository.update(id, fields);
  }
}
