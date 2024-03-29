import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Web3Service } from 'nest-web3';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from './access-token.entity';
import { Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly web3Service: Web3Service,
    @InjectRepository(AccessTokenEntity)
    private readonly authRepository: Repository<AccessTokenEntity>,
  ) {}
  getMessageToBeSigned(address: string) {
    const nonce = new Date().getTime();
    return this.jwtService.sign(
      { nonce, address },
      {
        expiresIn: '300s',
      },
    );
  }

  async issueAccessToken(token: string, signature: string) {
    const { address } = await this.jwtService.verify(token);
    const web3Client = this.web3Service.getClient('eth');
    const verifiedAddress = web3Client.eth.accounts.recover(token, signature);
    if (verifiedAddress.toLowerCase() === address.toLowerCase()) {
      const accessToken = this.jwtService.sign(
        { verifiedAddress },
        {
          expiresIn: '1d',
        },
      );

      await this.authRepository.save({
        accessToken,
      });

      return {
        accessToken,
        error: null,
      };
    }

    return {
      accessToken: null,
      error: `Failed to verify address ${address}`,
    };
  }

  async revokeToken(options: FindOptionsWhere<AccessTokenEntity>) {
    return await this.authRepository.delete(options);
  }
}
