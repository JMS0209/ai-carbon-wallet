export const useTransactor = () => {
  return async (callback: () => Promise<any>) => {
    try {
      return await callback();
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };
};
