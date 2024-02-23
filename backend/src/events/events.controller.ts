import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './event.dto';
import { WalletAddress } from '../utils';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/events')
  async index() {
    return await this.eventsService.findAll();
  }

  @Post('/events')
  @UseGuards(AuthGuard)
  create(
    @Body() createEventDto: CreateEventDto,
    @WalletAddress() walletAddress: string,
  ) {
    return this.eventsService.create({
      ...createEventDto,
      organizer: walletAddress,
    });
  }
}
