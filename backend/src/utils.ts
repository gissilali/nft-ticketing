import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from 'http';

export const WalletAddress = createParamDecorator(
  (_: never, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<IncomingMessage>();
    return req.headers['walletAddress'].toString();
  },
);
