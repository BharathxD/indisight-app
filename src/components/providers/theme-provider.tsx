"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeSwitcher = ({ children }: React.PropsWithChildren) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="dark"
    disableTransitionOnChange
    enableColorScheme
    enableSystem
  >
    {children}
  </NextThemesProvider>
);
