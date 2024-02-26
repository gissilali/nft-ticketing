import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateEventDto {
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  organizer: string;

  @IsOptional()
  lockAddress?: string | null;

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
  @Min(10)
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

  @IsNotEmpty()
  endDate: string;
}
