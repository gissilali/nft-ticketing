import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PublicLockV12 } from '@unlock-protocol/contracts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UnlockService {
  constructor(private readonly config: ConfigService) {}
  private getProvider(): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider(
      this.config.get('SEPOLIA_TESTNET_URL'),
    );
  }

  async getLockByAddress(address: string) {
    const provider = this.getProvider();
    const wallet = new ethers.Wallet(this.config.get('PRIVATE_KEY'), provider);
console.log({nyanye: this.config.get('PRIVATE_KEY')})
    const signer = wallet.connect(provider);
    const contract = new ethers.Contract(address, PublicLockV12.abi, signer);
    const keyPrice = ethers.utils.formatEther(await contract.keyPrice());
    const maxNumberOfKeys = await contract.maxNumberOfKeys();
    const name = await contract.name();
    const owner = await contract.owner();
    const expirationDuration = await contract.expirationDuration();
    const numberOfOwners = await contract.numberOfOwners();
    return {
      keyPrice,
      maxNumberOfKeys: parseInt(maxNumberOfKeys._hex),
      name,
      owner,
      expirationDuration: parseInt(expirationDuration._hex),
      numberOfOwners: parseInt(numberOfOwners._hex),
    };
  }
}
