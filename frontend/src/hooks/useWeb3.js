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

// This custom hook provides access to the Web3 library and Ethereum accounts.
export const useWeb3 = () => {
  const currentProvider = detectCurrentProvider();

  // Request user account access.
  const requestAccount = async () => {
    try {
      if (currentProvider) {
        // Request user permission to connect their Ethereum account.
        await currentProvider.request({ method: "eth_requestAccounts" });

        // Initialize a new Web3 instance using the detected provider.
        const web3 = new Web3(currentProvider);

        // Get the user's Ethereum accounts.
        const userAccounts = await web3.eth.getAccounts();
        const account = userAccounts[0];

        // Get the user's Ethereum balance.
        let ethBalance = await web3.eth.getBalance(account);

        // Return user data and any potential errors.
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
        // Return user data and any potential errors.
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

  /**
   * Checks the connection status and monitors account changes.
   * @param {function} handleSuccessfulConnection - Callback function to handle successful connection.
   * @param {function} handleFailedConnection - Callback function to handle failed connection.
   * @returns {boolean} - Indicates whether there are connected accounts.
   */
  const checkConnection = async (
    handleSuccessfulConnection,
    handleFailedConnection,
  ) => {
    const accounts = await currentProvider.request({ method: "eth_accounts" });

    // Listen for changes in Ethereum accounts.
    currentProvider.on("accountsChanged", async (accounts) => {
      const web3 = new Web3(currentProvider);
      if (accounts.length > 0) {
        // Get the balance of the selected account
        let ethBalance = await web3.eth.getBalance(accounts[0]);
        handleSuccessfulConnection({ accounts, ethBalance });
      } else {
        handleFailedConnection();
      }
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

    const amount = await publicLockContract.keyPrice();

    let str = "signed";
    let encoder = new TextEncoder();
    let bytes = encoder.encode(str);
    const referrerAddress = process.env.NEXT_PUBLIC_MOBIFI_WALLET_ADDRESS; // referrer receives a specified amount off of every key purchase
    const purchaseParams = [
      [amount],
      [signer.address],
      [referrerAddress], // referrer receives a specified amount off of every key purchase
      [ethers.ZeroAddress],
      [bytes], //here's where you put arbitrary data just make sure the length of this param should match the length of other params
    ];

    const options = {
      value: amount,
      gasLimit: 900000, //always set the gasLimit, it will throw an error otherwise
    };

    //attempt to purchase a ticket
    try {
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

    // Encode the function data for lock initialization.
    const callData = lockInterface.encodeFunctionData(
      "initialize(address,uint256,address,uint256,uint256,string)",
      [
        organizerAddress, // event organizer wallet address,
        eventDurationInSeconds,
        ethers.ZeroAddress,
        ethers.parseEther(event.ticketPrice.toString()), // Convert ticket price to wei,
        event.maxTickets > 0 ? event.maxTickets : MAX_UINT, // Set max number of tickets (or use MAX_UINT if unlimited)
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

    // Set the referrer fee for the lock. The fee is a flat rate, you can make this a percentage if you like.
    await publicLockContract.setReferrerFee(
      process.env.NEXT_PUBLIC_MOBIFI_WALLET_ADDRESS,
      1500,
    );

    if (event.maxTickets >= event.maxTicketsPerAccount) {
      // Update lock configuration.
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
