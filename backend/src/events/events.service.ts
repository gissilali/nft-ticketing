import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './event.dto';
import { UnlockService } from './unlock.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
    private readonly unlockService: UnlockService,
  ) {}

  findAll(): Promise<EventEntity[]> {
    return this.eventsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async create(event: CreateEventDto) {
    // const lock = await this.unlockService.createEventLock(event);
    // event.lockAddress = lock.address;
    return this.eventsRepository.save(event);
  }
}
