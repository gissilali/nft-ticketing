import {
  Controller,
  Get,
  Param,
  Post,
  Headers,
  Res,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/message/:address')
  getMessage(@Param('address') address: string) {
    return {
      message: this.authService.getMessageToBeSigned(address),
    };
  }

  @Post('/login')
  async login(
    @Headers('Authorization') authorizationHeader: string,
    @Body('signature') signature: string,
    @Res() response: Response,
  ) {
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    const { accessToken, error } = await this.authService.issueAccessToken(
      token,
      signature,
    );

    if (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }

    response.cookie('accessToken', accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: 'localhost',
    });

    return response.json({
      message: 'OK',
    });
  }

  @Post('/logout')
  async logout(@Res() response: Response) {
    response.clearCookie('accessToken', {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: 'localhost',
    });

    return response.end();
  }
}
