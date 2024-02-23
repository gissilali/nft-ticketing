"use client";

import { WalletMini } from "@/components/shared/icons/WalletMini";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";

export const UserProfileButton = ({ ethBalance, userAccount }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger  asChild>
          <Button variant={"outline"} className={"space-x-4"}>
            <span>
              <WalletMini />
            </span>
            <span>{ethBalance.toString()} ETH</span>
            <span className={"text-xl font-light text-slate-400"}>|</span>
            <span className={"truncate w-16"}>{userAccount}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{userAccount}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
