"use client";

import { MetaMaskLogo } from "@/components/shared/MetaMaskLogo";
import { useWeb3 } from "@/hooks/useWeb3";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

export const LoginButton = ({ onSuccessfulLogin: handleSuccessfulLogin }) => {
  const { handleLogin } = useAuth(handleSuccessfulLogin);
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
