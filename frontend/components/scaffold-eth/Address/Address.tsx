"use client";

import { Address as AddressType, getAddress, isAddress } from "viem";

type AddressProps = {
  address?: AddressType;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  onlyEnsOrAddress?: boolean;
};

export const Address = ({
  address,
  disableAddressLink,
  format,
  size = "base",
  onlyEnsOrAddress = false,
}: AddressProps) => {
  const checkSumAddress = address ? getAddress(address) : undefined;

  if (!checkSumAddress) {
    return <span className="text-sm">No address</span>;
  }

  if (!isAddress(checkSumAddress)) {
    return <span className="text-error">Wrong address</span>;
  }

  const shortAddress = checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4);
  const displayAddress = format === "long" ? checkSumAddress : shortAddress;

  return (
    <span className={`font-mono text-sm ${size === "lg" ? "text-lg" : size === "xl" ? "text-xl" : "text-sm"}`}>
      {onlyEnsOrAddress ? displayAddress : displayAddress}
    </span>
  );
};
