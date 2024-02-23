import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  create(event: CreateEventDto) {
    return this.eventsRepository.save(event);
  }
}
