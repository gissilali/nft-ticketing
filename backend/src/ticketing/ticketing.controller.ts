import {
  Body,
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
import { CreateTicketDto } from './ticket.dto';

@Controller('orders')
export class TicketingController {
  constructor(private readonly ticketingService: TicketingService) {}
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
    if (walletAddress.toLowerCase() !== attendeeAddress.toLowerCase()) {
      throw new HttpException(
        'Not authorized to get these tickets',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.ticketingService.findAll({
        where: {
          attendeeAddress: attendeeAddress.toLowerCase(),
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
  async handleTicketPurchase(
    @Param('eventId') eventId: string,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    try {
      return await this.ticketingService.create(
        Number(eventId),
        createTicketDto,
      );
    } catch (e: any) {
      console.log(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to complete transaction',
          debug: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }
  }
}
