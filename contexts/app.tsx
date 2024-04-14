"use client";

import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { User, UserCredits } from "@/types/user";
import { cacheGet, cacheSet } from "@/utils/cache";
import { createContext, useContext, useEffect, useState } from "react";

import { Song } from "@/types/song";
import { SongTask } from "@/types/task";
import { getTimestamp } from "@/utils/time";
import useOneTapLogin from "@/hooks/useOneTapLogin";

export const useAppContext = () => useContext(AppContext);

export const AppContext = createContext({} as ContextProviderValue);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  useOneTapLogin();

  const [theme, setTheme] = useState("light");
  const [locale, setLocale] = useState("");
  const [isSiderOpen, setIsSiderOpen] = useState(false);
  const [isShowSignPanel, setIsShowSignPanel] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songTask, setSongTask] = useState<SongTask | null>(null);
  const [songTaskStep, setSongTaskStep] = useState(1);

  const appendPlaylist = (newSong: Song) => {
    console.log("add newsong", newSong);
    setPlaylist((currentPlaylist) => [newSong, ...currentPlaylist]);
  };

  const loadPlaylist = () => {
    const _playlist = cacheGet("PLAYLIST");
    const _play_idx = cacheGet("PLAY_IDX") || "0";
    if (_playlist) {
      const playlist = JSON.parse(_playlist);
      let play_idx = Number(_play_idx);
      if (play_idx < 0 || play_idx >= playlist.length) {
        play_idx = 0;
      }

      setPlaylist(playlist);
      setCurrentSongIndex(play_idx);
    }
  };

  useEffect(() => {
    loadPlaylist();

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

  useEffect(() => {
    if (playlist && playlist.length > 0) {
      const expires = getTimestamp() + 2592000; // 30 days
      cacheSet("PLAYLIST", JSON.stringify(playlist), expires);
    }
  }, [playlist]);

  useEffect(() => {
    if (currentSongIndex >= 0) {
      const expires = getTimestamp() + 2592000; // 30 days
      cacheSet("PLAY_IDX", currentSongIndex.toString(), expires);
    }
  }, [currentSongIndex]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        locale,
        setLocale,
        isSiderOpen,
        setIsSiderOpen,
        isShowSignPanel,
        setIsShowSignPanel,
        user,
        setUser,
        userCredits,
        setUserCredits,
        playlist,
        setPlaylist,
        appendPlaylist,
        currentSong,
        setCurrentSong,
        currentSongIndex,
        setCurrentSongIndex,
        songTask,
        setSongTask,
        songTaskStep,
        setSongTaskStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
