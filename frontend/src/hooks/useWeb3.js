import Web3 from "web3";
import { ethers, BrowserProvider, Contract } from "ethers";
import { PublicLockV12 } from "@unlock-protocol/contracts";

const detectCurrentProvider = () => {
  let provider;
  if (typeof window !== "undefined") {
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      alert(
        "Non-ethereum browser detected. Please install the Metamask to continue",
      );
    }
  }

  return provider;
};

export const useWeb3 = () => {
  const currentProvider = detectCurrentProvider();

  const requestAccount = async () => {
    try {
      if (currentProvider) {
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);

        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account);

        return {
          userData: {
            ethBalance,
            account,
            userAccount,
          },
          error: null,
        };
      }
    } catch (err) {
      return {
        userData: null,
        error: err,
      };
    }
  };

  const signMessage = async (message, address) => {
    await currentProvider.request({ method: "eth_requestAccounts" });
    const web3 = new Web3(currentProvider);
    return await web3.eth.personal.sign(message, address, "");
  };

  const checkConnection = async () => {
    const accounts = await currentProvider.request({ method: "eth_accounts" });
    return accounts.length > 0;
  };

  const purchaseLock = async (lockAddress) => {
    const provider = new BrowserProvider(currentProvider);
    const signer = await provider.getSigner();
    const publicLockContract = new Contract(
      lockAddress,
      PublicLockV12.abi,
      signer,
    );

    console.log({ signer });

    const amount = await publicLockContract.keyPrice();

    console.log({ amount: amount });

    console.log({ address: signer.address });
    let str = "Hello, World!";
    let encoder = new TextEncoder();
    let bytes = encoder.encode(str);
    const purchaseParams = [
      [amount],
      [signer.address],
      [signer.address],
      [ethers.ZeroAddress],
      [bytes],
    ];

    const options = {
      value: amount,
      gasLimit: 500000,
    };
    const transaction = await publicLockContract.purchase(
      ...purchaseParams,
      options,
    );
    try {
      const receipt = await transaction.wait();

      return {
        value: {
          receipt,
          amount: ethers.formatUnits(amount),
        },
        error: null,
      };
    } catch (e) {
      return {
        value: null,
        error: e,
      };
    }
  };

  return {
    requestAccount,
    signMessage,
    checkConnection,
    purchaseLock,
  };
};
