import Web3 from "web3";
import { ethers, BrowserProvider, Contract } from "ethers";
import { PublicLockV12, UnlockV12 } from "@unlock-protocol/contracts";
import moment from "moment";

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

export const MAX_UINT = 4294967295; // 2**56 -1 throws an error, so I settled for 4 billion

export const useWeb3 = () => {
  const currentProvider = detectCurrentProvider();

  const requestAccount = async () => {
    try {
      if (currentProvider) {
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);

        const userAccounts = await web3.eth.getAccounts();
        const account = userAccounts[0];
        let ethBalance = await web3.eth.getBalance(account);

        return {
          userData: {
            ethBalance,
            account,
            userAccounts,
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

  const checkConnection = async (handleAccountChanged) => {
    const accounts = await currentProvider.request({ method: "eth_accounts" });
    currentProvider.on("accountsChanged", async (accounts) => {
      const web3 = new Web3(currentProvider);
      let ethBalance = await web3.eth.getBalance(accounts[0]);
      handleAccountChanged({ accounts, ethBalance });
    });
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
    const referrerAddress = process.env.NEXT_PUBLIC_MOBIFI_WALLET_ADDRESS;
    console.log({ referrerAddress });
    console.log();
    const purchaseParams = [
      [amount],
      [signer.address],
      [referrerAddress],
      [ethers.ZeroAddress],
      [bytes],
    ];

    const options = {
      value: amount,
      gasLimit: 900000,
    };

    try {
      const referrerFees =
        await publicLockContract.referrerFees(referrerAddress);

      console.log({ referrerFees });

      const transaction = await publicLockContract.purchase(
        ...purchaseParams,
        options,
      );
      const receipt = await transaction.wait();

      return {
        value: {
          receipt,
          amount: ethers.formatUnits(amount),
        },
        error: null,
      };
    } catch (e) {
      console.log(e);
      return {
        value: null,
        error: e,
      };
    }
  };

  const createLock = async (event, organizerAddress) => {
    const provider = new BrowserProvider(currentProvider);
    const signer = await provider.getSigner();

    const unlockAddress = process.env.NEXT_PUBLIC_UP_SEPOLIA_ADDRESS;

    console.log({ unlockAddress });

    const unlockContract = new Contract(unlockAddress, UnlockV12.abi, signer);
    const lockInterface = new ethers.Interface(PublicLockV12.abi);

    const startDate = moment(event.startDate).startOf("day");
    const endDate = moment(event.endDate).endOf("day");
    const eventDurationInSeconds = endDate.diff(startDate, "s");
    const callData = lockInterface.encodeFunctionData(
      "initialize(address,uint256,address,uint256,uint256,string)",
      [
        organizerAddress, // event organizer wallet address,
        eventDurationInSeconds,
        ethers.ZeroAddress,
        ethers.parseEther(event.ticketPrice.toString()), //key price,
        event.maxTickets >= 0 ? event.maxTickets : MAX_UINT, //max number of tickets
        `${event.title} Contract`,
      ],
    );

    console.log(unlockContract);

    const transaction = await unlockContract.createUpgradeableLockAtVersion(
      callData,
      12,
    );

    const receipt = await transaction.wait();
    const lock = receipt.logs[0];
    const publicLockContract = new Contract(
      lock.address,
      PublicLockV12.abi,
      signer,
    );

    await publicLockContract.setReferrerFee(
      process.env.NEXT_PUBLIC_MOBIFI_WALLET_ADDRESS,
      1500,
    );

    if (event.maxTickets >= event.maxTicketsPerAccount) {
      await publicLockContract.updateLockConfig(
        eventDurationInSeconds,
        event.maxTickets >= 0 ? event.maxTickets : MAX_UINT,
        Number(event.maxTicketsPerAccount),
      );
    }

    return lock;
  };

  return {
    requestAccount,
    signMessage,
    checkConnection,
    purchaseLock,
    createLock,
  };
};
