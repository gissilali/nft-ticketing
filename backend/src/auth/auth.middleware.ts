import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken;

    if (token) {
      try {
        const data = this.jwtService.verify(token, {
          secret: this.configService.get('APP_KEY'),
        });
        req.headers.walletAddress = data.verifiedAddress;
      } catch (e) {
        console.log(e);
      }
    }

    next();
  }
}
