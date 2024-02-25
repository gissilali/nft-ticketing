import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PublicLockV12, UnlockV12 } from '@unlock-protocol/contracts';
import { CreateEventDto } from './event.dto';
import moment from 'moment';

const MAX_UINT = 4294967295; // 2**56 -1 throws an error, so I settled for 4 billion
@Injectable()
export class UnlockService {
  private getProvider(): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/pf_y7LnQqs4GoA7ic32QAB-SFe9qMJ1Y`,
    );
  }
  async createEventLock(event: CreateEventDto) {
    const provider = this.getProvider();
    const wallet = new ethers.Wallet(
      '96a6e7a5444a069407a68e03c0d9b0177ae6f5b1ddc0787d696e7ba6d5b52788',
      provider,
    );

    const signer = wallet.connect(provider);

    const unlockAddress = '0x36b34e10295cCE69B652eEB5a8046041074515Da';

    const unlockContract = new ethers.Contract(
      unlockAddress,
      UnlockV12.abi,
      signer,
    );
    const lockInterface = new ethers.utils.Interface(PublicLockV12.abi);

    const eventDurationInSeconds = this.getEventDuration(event);
    const callData = lockInterface.encodeFunctionData(
      'initialize(address,uint256,address,uint256,uint256,string)',
      [
        event.organizer, // event organizer wallet address,
        eventDurationInSeconds,
        ethers.constants.AddressZero,
        ethers.utils.parseEther(event.ticketPrice.toString()), //key price,
        event.maxTickets >= 0 ? event.maxTickets : MAX_UINT, //max number of tickets
        `${event.title} Contract`,
      ],
    );

    const transaction = await unlockContract.createUpgradeableLockAtVersion(
      callData,
      12,
    );

    const receipt = await transaction.wait();

    return receipt.logs[0];
  }

  async purchaseKey(lockAddress: string) {
    const provider = this.getProvider();
    const wallet = new ethers.Wallet(
      '96a6e7a5444a069407a68e03c0d9b0177ae6f5b1ddc0787d696e7ba6d5b52788',
      provider,
    );

    const signer = wallet.connect(provider);
    console.log({ lockAddress, signer });
    const publicLockContract = new ethers.Contract(
      lockAddress,
      PublicLockV12.abi,
      signer,
    );

    const amount = await publicLockContract.keyPrice();

    console.log({ amount });

    const purchaseParams = [
      [amount],
      [signer.address],
      [signer.address],
      [ethers.constants.AddressZero],
      [[]],
    ];

    const options = {
      value: amount,
      gasLimit: 590900,
    };

    const transaction = await publicLockContract.purchase(
      ...purchaseParams,
      options,
    );

    const receipt = await transaction.wait();

    return {
      details: receipt,
      amount,
    };
  }

  private getEventDuration(event: CreateEventDto) {
    const startDate = moment(event.startDate).startOf('day');
    const endDate = moment(event.endDate).endOf('day');
    return endDate.diff(startDate, 's');
  }

  async getLockByAddress(address: string) {
    const provider = this.getProvider();
    const wallet = new ethers.Wallet(
      '96a6e7a5444a069407a68e03c0d9b0177ae6f5b1ddc0787d696e7ba6d5b52788',
      provider,
    );

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

  async sendEth(amountInEther: string, receiverAddress: string) {
    const provider = this.getProvider();
    const wallet = new ethers.Wallet(
      '96a6e7a5444a069407a68e03c0d9b0177ae6f5b1ddc0787d696e7ba6d5b52788',
      provider,
    );

    const transactionResponse = await wallet.sendTransaction({
      to: receiverAddress,
      value: ethers.utils.parseEther(amountInEther),
    });

    return {
      details: transactionResponse,
      amount: amountInEther,
    };
  }
}
