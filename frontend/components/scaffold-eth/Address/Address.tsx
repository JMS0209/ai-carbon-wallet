"use client";

import { Address } from "viem";

interface AddressProps {
  address?: Address;
  className?: string;
}

export const AddressComponent = ({ address, className }: AddressProps) => {
  if (!address) return null;

  return (
    <span className={`font-mono text-sm ${className}`}>
      {address.slice(0, 6)}...{address.slice(-4)}
    </span>
  );
};
