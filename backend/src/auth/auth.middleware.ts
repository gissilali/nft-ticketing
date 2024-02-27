import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from './access-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(AccessTokenEntity)
    private readonly authRepository: Repository<AccessTokenEntity>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken;
    const exists = await this.authRepository.findOne({
      where: {
        accessToken: token,
      },
    });
    if (token && exists) {
      try {
        const data = this.jwtService.verify(token, {
          secret: this.configService.get('APP_KEY'),
        });
        req.headers.walletAddress = data.verifiedAddress;
        req.headers.accessToken = token;
      } catch (e) {
        console.log(e);
      }
    }

    next();
  }
}
