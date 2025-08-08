import { useState } from "react";

export const useDisplayUsdMode = () => {
  const [displayUsdMode, setDisplayUsdMode] = useState(false);

  return {
    displayUsdMode,
    setDisplayUsdMode,
  };
};
