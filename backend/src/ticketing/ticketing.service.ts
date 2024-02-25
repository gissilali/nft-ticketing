import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity, TransactionDetails } from './ticket.entity';
import { Repository } from 'typeorm';
import { EventEntity } from '../events/event.entity';
import { UnlockService } from '../events/unlock.service';
import { ethers } from 'ethers';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class TicketingService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketsRepository: Repository<TicketEntity>,
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
    private readonly unlockService: UnlockService,
  ) {}

  async create(eventId: string) {
    const event = await this.eventsRepository.findOne({
      where: {
        id: Number(eventId),
      },
    });

    console.log({ event });

    const receipt = await this.unlockService.purchaseKey(event.lockAddress);

    console.log({ receipt });

    return await this.ticketsRepository.save({
      eventId: event.id,
      attendeeAddress: receipt.details.from,
      ticketPrice: ethers.utils.formatEther(receipt.amount).toString(),
      transactionHash: receipt.details.transactionHash,
      organizer: event.organizer,
      transactionDetails: receipt.details as TransactionDetails,
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
    console.log(defaultOption);
    return await this.ticketsRepository.find(defaultOption);
  }

  async update(id: number, fields: QueryDeepPartialEntity<TicketEntity>) {
    return await this.ticketsRepository.update(id, fields);
  }
}
