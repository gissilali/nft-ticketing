import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";

export const ContractDetailsCard = ({ contract }) => {
  return (
    <>
      {contract ? (
        <>
          <p className={"text-sm text-slate-700 font-semibold mb-1"}>
            Contract Details
          </p>
          <div
            className={"border flex-col flex border-slate-300 rounded-xl p-4"}
          >
            <div className={"flex flex-1 mb-4 justify-between items-start"}>
              <h3 className={"font-semibold w-8/12 tracking-tight"}>
                {contract.name}
              </h3>
              <span className={"text-sm"}>{contract.keyPrice} ETH</span>
            </div>
            <div className={"flex text-sm space-x-4"}>
              <span>
                Duration{" "}
                <span className={"font-semibold"}>
                  {contract.expirationDuration === 0
                    ? "Unlimited"
                    : contract.expirationDuration}
                </span>
              </span>
              <span>
                <span className={"font-semibold"}>
                  {contract.maxNumberOfKeys - contract.numberOfOwners}
                </span>{" "}
                tickets left
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className={"text-sm text-slate-700 mb-1"}>
            Fetching contract details...
          </p>
          <div
            className={
              "border animate-pulse flex-col flex border-slate-300 rounded-xl p-4"
            }
          >
            <div className={"flex flex-1 mb-4 justify-between items-start"}>
              <div className={"w-6/12 h-4 rounded bg-slate-300"}></div>
              <div className={"w-3/12 h-4 rounded bg-slate-300"}></div>
            </div>
            <div className={"flex text-sm space-x-4"}>
              <div className={"w-4/12 h-4 rounded bg-slate-300"}></div>
              <div className={"w-3/12 h-4 rounded bg-slate-300"}></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
