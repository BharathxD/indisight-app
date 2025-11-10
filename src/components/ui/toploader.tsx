"use client";

import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState } from "react";

export const TopLoader = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <NextTopLoader color="#d4d4d4" shadow={false} showSpinner={false} />;
  }

  return (
    <NextTopLoader
      color={theme === "dark" ? "#d4d4d4" : "#171717"}
      shadow={false}
      showSpinner={false}
    />
  );
};
