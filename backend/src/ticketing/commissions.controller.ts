import { Controller } from '@nestjs/common';
import { TicketEntity } from './ticket.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { UnlockService } from '../events/unlock.service';
import { TicketingService } from './ticketing.service';

@Controller('commissions')
export class CommissionsController {
  constructor(
    private readonly unlockService: UnlockService,
    private readonly ticketingService: TicketingService,
  ) {}
  @OnEvent('ticket.purchased')
  async deductCommission(ticket: TicketEntity) {
    const commissionAmount = (Number(ticket.ticketPrice) * 5) / 100;
    const transactionResponse = await this.unlockService.sendEth(
      commissionAmount.toString(),
      '0xadc384FE4fB34f1cbd1e37BF8476d0dA3572dd24',
    );

    await this.ticketingService.update(ticket.id, {
      commissionDeducted: transactionResponse.amount,
      commissionTransactionHash: transactionResponse.details.hash,
    });

    console.log({ transactionResponse });
  }
}
