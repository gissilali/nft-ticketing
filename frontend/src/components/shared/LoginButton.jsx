"use client";

import { MetaMaskLogo } from "@/components/shared/MetaMaskLogo";
import { useWeb3 } from "@/hooks/useWeb3";
import axios from "axios";

export const LoginButton = ({ onSuccessfulLogin: handleSuccessfulLogin }) => {
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

  return (
    <button
      onClick={handleLogin}
      className="inline-flex justify-center items-center space-x-4 rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700  ml-8"
    >
      <span>
        <MetaMaskLogo />
      </span>
      <span>Login</span>
    </button>
  );
};
