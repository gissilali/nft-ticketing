import { IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  transactionHash: string;

  @IsNotEmpty()
  ticketPrice: string;

  @IsNotEmpty()
  attendeeAddress: string;
}
