import { Address } from "viem";

export const useWatchBalance = (address?: Address) => {
  return {
    data: null,
    isLoading: false,
  };
};
