"use client";

import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useContext, useEffect, useState } from "react";

import { Song } from "@/types/song";
import { User } from "@/types/user";
import { cacheGet } from "@/utils/cache";
import useOneTapLogin from "@/hooks/useOneTapLogin";

export const useAppContext = () => useContext(AppContext);

export const AppContext = createContext({} as ContextProviderValue);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  useOneTapLogin();

  const [theme, setTheme] = useState("light");
  const [locale, setLocale] = useState("");
  const [isSiderOpen, setIsSiderOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(9);

  const appendPlaylist = (newSong: Song) => {
    console.log("add newsong", newSong);
    setPlaylist((currentPlaylist) => [newSong, ...currentPlaylist]);
  };

  useEffect(() => {
    const themeInCache = cacheGet("THEME");
    if (themeInCache && ["dark", "light"].includes(themeInCache)) {
      setTheme(themeInCache);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = () => {
      setTheme(mediaQuery.matches ? "dark" : "light");
    };
    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        locale,
        setLocale,
        isSiderOpen,
        setIsSiderOpen,
        user,
        setUser,
        playlist,
        setPlaylist,
        appendPlaylist,
        currentSong,
        setCurrentSong,
        currentSongIndex,
        setCurrentSongIndex,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
