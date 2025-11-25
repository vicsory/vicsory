// lib/ThemeContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextProps {
  isGoldTheme: boolean;
  setGoldTheme: (isGold: boolean, isPremium: boolean) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  isGoldTheme: false,
  setGoldTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isGoldTheme, setIsGoldTheme] = useState(false);

  const setGoldTheme = (isGold: boolean, isPremium: boolean) => {
    if (isPremium) {
      setIsGoldTheme(isGold);
    } else {
      setIsGoldTheme(false); // Ensure non-premium users can't enable gold theme
    }
  };

  return (
    <ThemeContext.Provider value={{ isGoldTheme, setGoldTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);