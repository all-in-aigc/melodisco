"use client";

import { AppContext } from "@/contexts/app";
import { Inter } from "next/font/google";
import { useContext } from "react";

const inter = Inter({ subsets: ["latin"] });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useContext(AppContext);

  return (
    <body className={`w-screen h-screen`} data-theme={theme}>
      {children}
    </body>
  );
}
