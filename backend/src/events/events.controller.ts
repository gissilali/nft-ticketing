import { Controller, Get } from '@nestjs/common';

@Controller()
export class EventsController {
  constructor() {}

  @Get('/events')
  index(): string {
    return 'events';
  }
}
