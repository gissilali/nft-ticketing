import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './event.dto';
import { UnlockService } from './unlock.service';
// import { ethers } from 'hardhat';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    private readonly unlockService: UnlockService,
  ) {}

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async create(event: CreateEventDto) {
    // await this.unlockService.createLock({
    //   name: event.title,
    //   keyPrice: ethers.utils.parseEther(event.ticketPrice.toString()),
    //   maxNumberOfKeys: event.maxTickets,
    //   currencyContractAddress: ethers.constants.AddressZero,
    //   expirationDuration: 60 * 60 * 24 * 365,
    //   unlockAddress: event.organizer,
    // });
    return this.eventsRepository.save(event);
  }
}
