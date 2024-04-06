"use client";

import { AppContext } from "@/contexts/app";
import { useContext } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useContext(AppContext);

  return (
    <div className="w-screen h-screen" data-theme={theme}>
      {children}
    </div>
  );
}
