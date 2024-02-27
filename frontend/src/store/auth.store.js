import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      account: null,
      userAccounts: [],
      ethBalance: 0,
      isConnected: false,
      updateUserDetails: ({ account, userAccounts, ethBalance }) => {
        return set({
          account,
          userAccounts,
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
