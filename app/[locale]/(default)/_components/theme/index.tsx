"use client";

import { BsMoonStars, BsSun } from "react-icons/bs";

import { cacheSet } from "@/utils/cache";
import { useAppContext } from "@/contexts/app";

export default function () {
  const { theme, setTheme } = useAppContext();

  const handleThemeChange = function (_theme: string) {
    cacheSet("THEME", _theme, -1);
    setTheme(_theme);
  };

  return (
    <>
      {theme === "dark" ? (
        <BsSun
          className="cursor-pointer text-md"
          onClick={() => handleThemeChange("light")}
        />
      ) : (
        <BsMoonStars
          className="cursor-pointer text-lg"
          onClick={() => handleThemeChange("dark")}
        />
      )}
    </>
  );
}
