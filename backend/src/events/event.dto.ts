import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateEventDto {
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  organizer: string;

  @IsNotEmpty({
    message: 'Venue is required',
  })
  venue: string;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'Max tickets should be a number',
    },
  )
  maxTickets?: number | null;

  @IsNotEmpty()
  @IsNumber(
    {},
    {
      message: 'Ticket price should be a number',
    },
  )
  ticketPrice: number;

  @IsNotEmpty()
  startDate: string;
}
