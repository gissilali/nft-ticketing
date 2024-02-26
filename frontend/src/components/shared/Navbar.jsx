"use client";

import Link from "next/link";
import { LoginButton } from "@/components/shared/LoginButton";
import useAuthStore from "@/store/auth.store";
import { UserProfileButton } from "@/components/shared/UserProfileButton";
import { useWeb3 } from "@/hooks/useWeb3";
import { useEffect } from "react";
import { Logo } from "@/components/shared/Logo";
import { AddEventButton } from "@/components/events/AddEventButton";
import axios from "axios";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { updateUserDetails, isConnected, ethBalance, userAccount } =
    useAuthStore();
  const pathname = usePathname();

  const { checkConnection } = useWeb3();

  useEffect(() => {
    (async () => {
      const isConnected = await checkConnection();
      if (isConnected === false) {
        logout();
      }
    })();
  }, []);

  const logout = () => {
    axios
      .post("/auth/logout")
      .then((response) => {
        updateUserDetails({
          account: null,
          userAccount: [],
          ethBalance: 0,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleSuccessfulLogin = ({
    account,
    ethBalance,
    userAccount,
    accessToken,
  }) => {
    updateUserDetails({ account, ethBalance, userAccount, accessToken });
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const navigation = [
    { name: "All Events", href: "/" },
    { name: "My Tickets", href: "/tickets" },
    { name: "My Sales", href: "/sales" },
  ];

  return (
    <div className={"border border-b"}>
      <div className="mx-auto container">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <Logo />
          </Link>
          <div>
            {isConnected ? (
              <div className={"flex space-x-8 items-center"}>
                <nav
                  className="hidden lg:flex lg:space-x-8 lg:py-2"
                  aria-label="Global"
                >
                  {navigation.map((item) => {
                    const isCurrent = pathname === item.href;
                    console.log({ location: pathname });
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          isCurrent
                            ? "bg-gray-200 text-gray-900"
                            : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                          "inline-flex items-center rounded-md py-2 px-3 text-sm font-medium",
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                <AddEventButton />
                <UserProfileButton
                  ethBalance={ethBalance}
                  userAccount={userAccount}
                />
              </div>
            ) : (
              <LoginButton onSuccessfulLogin={handleSuccessfulLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
