import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateEventDto } from './event.dto';
import { WalletAddress } from '../utils';
import { EventsService } from './events.service';
import { UnlockService } from './unlock.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly unlockService: UnlockService,
  ) {}

  @Get('/')
  async index() {
    return await this.eventsService.findAll();
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  @Post('/')
  @UseGuards(AuthGuard)
  async create(
    @Body() createEventDto: CreateEventDto,
    @WalletAddress() walletAddress: string,
  ) {
    try {
      return this.eventsService.create({
        ...createEventDto,
        organizer: walletAddress,
      });
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/:contractAddress/contract')
  @UseGuards(AuthGuard)
  async getContractDetails(@Param('contractAddress') address: string) {
    return this.unlockService.getLockByAddress(address);
  }
}
