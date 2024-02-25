import { Injectable } from '@nestjs/common';
import { unlock } from 'hardhat';
import { CreateLockArgs } from '@unlock-protocol/hardhat-plugin/dist/src/createLock';

@Injectable()
export class UnlockService {
  deployContract() {
    return unlock.deployProtocol();
  }

  // createLock(args: CreateLockArgs) {
  //   // return unlock.createLock(args);
  // }
}
