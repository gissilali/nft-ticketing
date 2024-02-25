import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketingService } from './ticketing.service';
import { AuthGuard } from '../auth/auth.guard';
import { WalletAddress } from '../utils';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';

@Controller('orders')
export class TicketingController {
  constructor(
    private readonly ticketingService: TicketingService,
    private readonly eventEmitter: EventEmitter,
  ) {}
  @Get('/')
  @UseGuards(AuthGuard)
  async getTickets(@WalletAddress() address: string) {
    try {
      return await this.ticketingService.findAll({
        where: {
          organizer: address,
        },
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch tickets',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }
  }

  @Get('/:attendeeAddress')
  @UseGuards(AuthGuard)
  async getTicketsByAttendeeAddress(
    @WalletAddress() walletAddress: string,
    @Param('attendeeAddress') attendeeAddress: string,
  ) {
    if (walletAddress !== attendeeAddress) {
      throw new HttpException(
        'Not authorized to get these tickets',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.ticketingService.findAll({
        where: {
          attendeeAddress,
        },
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch tickets',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }
  }

  @Post('/:eventId/tickets')
  @UseGuards(AuthGuard)
  async handleTicketPurchase(@Param('eventId') eventId: string) {
    try {
      const ticket = await this.ticketingService.create(eventId);
      this.eventEmitter.emit('ticket.purchased', ticket);
      return ticket;
    } catch (e: any) {
      console.log(e);
      console.log(e.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to complete transaction',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }
  }
}
