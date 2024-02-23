import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [JwtService, AuthService, ConfigService],
})
export class AuthModule {}
