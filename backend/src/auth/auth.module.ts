import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenEntity } from './access-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessTokenEntity])],
  exports: [TypeOrmModule],
  controllers: [AuthController],
  providers: [JwtService, AuthService, ConfigService],
})
export class AuthModule {}
