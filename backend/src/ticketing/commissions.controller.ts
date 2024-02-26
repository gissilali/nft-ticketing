import { Controller } from '@nestjs/common';
import { TicketEntity } from './ticket.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { UnlockService } from '../events/unlock.service';
import { TicketingService } from './ticketing.service';
import { ConfigService } from '@nestjs/config';

@Controller('commissions')
export class CommissionsController {
  constructor(
    private readonly unlockService: UnlockService,
    private readonly ticketingService: TicketingService,
    private readonly config: ConfigService,
  ) {}
  @OnEvent('ticket.purchased')
  async deductCommission(ticket: TicketEntity) {
    const commissionAmount = (Number(ticket.ticketPrice) * 5) / 100;
    const transactionResponse = await this.unlockService.sendEth(
      commissionAmount.toString(),
      this.config.get('MOBIFI_WALLET_ADDRESS'),
    );

    await this.ticketingService.update(ticket.id, {
      commissionDeducted: transactionResponse.amount,
      commissionTransactionHash: transactionResponse.details.hash,
    });

    console.log({ transactionResponse });
  }
}
