import axios from "axios";
import { useWeb3 } from "@/hooks/useWeb3";

export const useAuth = (handleSuccessfulLogin) => {
  const { requestAccount, signMessage } = useWeb3();

  const fetchAccessToken = async (signature, temporaryToken) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
      {
        signature,
      },
      {
        headers: {
          Authorization: `Bearer ${temporaryToken}`,
          "Access-Control-Allow-Credentials": true,
        },
        withCredentials: true,
      },
    );

    return response.data;
  };

  const fetchMessageToBeSigned = async (address) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/message/${address}`,
    );
    return response.data.message;
  };
  const handleLogin = async () => {
    const { userData, error } = await requestAccount();

    if (error) {
      if (error?.code === -32002) {
        alert("Please login via your metamask extension to continue");
        return;
      }

      alert("Failed to authenticate user");

      return;
    }

    const messageToBeSigned = await fetchMessageToBeSigned(userData.account);

    const signature = await signMessage(messageToBeSigned, userData.account);

    await fetchAccessToken(signature, messageToBeSigned);

    handleSuccessfulLogin(userData);
  };

  const handleLogout = async (handleSuccessfulLogout) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        handleSuccessfulLogout({
          account: null,
          userAccount: [],
          ethBalance: 0,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const refreshAccessToken = async (address) => {
    const messageToBeSigned = await fetchMessageToBeSigned(address);

    const signature = await signMessage(messageToBeSigned, address);

    await fetchAccessToken(signature, messageToBeSigned);
  };

  return {
    handleLogin,
    refreshAccessToken,
    handleLogout,
  };
};
