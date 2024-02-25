import { HardhatUserConfig } from 'hardhat/config';
import '@unlock-protocol/hardhat-plugin';

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  paths: {
    sources: './src/blockchain/contracts',
    artifacts: './src/blockchain/artifacts/artifacts',
  },
  networks: {
    sepolia: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/pf_y7LnQqs4GoA7ic32QAB-SFe9qMJ1Y',
      accounts: [''],
    },
  },
};

export default config;
