import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      account: [],
      userAccount: null,
      ethBalance: 0,
      isConnected: false,
      updateUserDetails: ({ account, userAccount, ethBalance }) => {
        return set({
          account,
          userAccount,
          ethBalance: ethBalance.toString(),
          isConnected: !!account,
        });
      },
      updateIsConnected: (isConnected) => set({ isConnected }),
    }),
    {
      name: "userDetails",
    },
  ),
);

export default useAuthStore;
