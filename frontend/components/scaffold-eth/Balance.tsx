"use client";

import { Address } from "viem";
import { useBalance } from "wagmi";

interface BalanceProps {
  address?: Address;
  className?: string;
}

export const Balance = ({ address, className }: BalanceProps) => {
  const { data } = useBalance({
    address,
  });

  return (
    <div className={`text-sm ${className}`}>
      <span className="font-bold">{data?.formatted ?? "0"}</span>
      <span className="text-xs"> {data?.symbol}</span>
    </div>
  );
};
