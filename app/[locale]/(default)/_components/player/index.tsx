"use client";

import "./player.css";

import {
  MdFormatListNumbered,
  MdOutlineFavorite,
  MdOutlineFavoriteBorder,
  MdOutlineFormatListBulleted,
  MdOutlinePause,
  MdOutlinePlayArrow,
  MdOutlineRepeatOne,
  MdOutlineShare,
  MdOutlineSkipNext,
  MdOutlineSkipPrevious,
  MdShuffle,
} from "react-icons/md";
import React, { useContext, useEffect, useRef, useState } from "react";

import { AiOutlineSound } from "react-icons/ai";
import Image from "next/image";
import Share from "../share";
import { Slider } from "@/components/ui/slider";
import { Song } from "@/types/song";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();
  const { user } = useAppContext();
  const {
    playlist,
    currentSong,
    setCurrentSong,
    currentSongIndex,
    setCurrentSongIndex,
    setIsShowSignPanel,
  } = useAppContext();

  const [song, setSong] = useState<Song | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [playMode, setPlayMode] = useState("sequence"); // sequence, loop, shuffle
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [splitLyrics, setSplitLyrics] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audioPlay(audio);
    }
    setIsPlaying(!isPlaying);
  };

  const fetchFavoriteSong = async function (song_uuid: string) {
    try {
      const params = {
        song_uuid: song_uuid,
      };
      const resp = await fetch("/api/get-favorite-song", {
        method: "POST",
        headers: {
          "Content-Type": "applicaion/json",
        },
        body: JSON.stringify(params),
      });
      const { data } = await resp.json();

      if (data && data.status === "on") {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (e) {
      console.log("fetch favorite song failed:", e);
    }
  };

  const updateFavoriteSong = async function (song_uuid: string) {
    try {
      const params = {
        song_uuid: song_uuid,
        status: isLiked ? "off" : "on",
      };
      const resp = await fetch("/api/update-favorite-song", {
        method: "POST",
        headers: {
          "Content-Type": "applicaion/json",
        },
        body: JSON.stringify(params),
      });
      const { data } = await resp.json();

      if (data && data.status === "on") {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (e) {
      console.log("update favorite song failed:", e);
    }
  };

  const updatePlaySong = async function (song_uuid: string) {
    try {
      const params = {
        song_uuid: song_uuid,
      };
      const resp = await fetch("/api/update-play-song", {
        method: "POST",
        headers: {
          "Content-Type": "applicaion/json",
        },
        body: JSON.stringify(params),
      });
      const { code, message } = await resp.json();

      if (code !== 0) {
        console.log("update play song failed: ", message);
      }
    } catch (e) {
      console.log("update play song failed:", e);
    }
  };

  const toggleLike = () => {
    if (!song || !song.uuid) {
      return;
    }
    if (!user || !user.uuid) {
      setIsShowSignPanel(true);
      return;
    }

    updateFavoriteSong(song.uuid);
  };

  const togglePlayMode = () => {
    if (playMode === "sequence") {
      setPlayMode("shuffle");
    } else if (playMode === "shuffle") {
      setPlayMode("loop");
    } else {
      setPlayMode("sequence");
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const changeProgress = (event: { clientX: any }) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) {
      return;
    }

    const clickX = event.clientX;
    const { left, width } = progressBar.getBoundingClientRect();
    const clickProgress = (clickX - left) / width;
    const newTime = clickProgress * audio.duration;
    audio.currentTime = newTime;

    setProgress(clickProgress);
  };

  const startDrag = (event: { clientX: any }) => {
    setIsDragging(true);
    changeProgress(event);
  };

  const onDragging = (event: { clientX: any }) => {
    if (isDragging) {
      changeProgress(event);
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const playNext = () => {
    if (!playlist) {
      return;
    }
    switch (playMode) {
      case "sequence":
        setCurrentSongIndex(
          (prevIndex: number) => (prevIndex + 1) % playlist.length
        );
        break;
      case "loop":
        if (audioRef.current) {
          audioPlay(audioRef.current);
        }
        break;
      case "shuffle":
        let nextIndex,
          currentIndex = currentSongIndex;
        do {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } while (playlist.length > 1 && nextIndex === currentIndex);
        setCurrentSongIndex(nextIndex);
        break;
      default:
        console.log(`Unsupported play mode: ${playMode}`);
    }
  };

  const playPrev = () => {
    if (!playlist) {
      return;
    }
    switch (playMode) {
      case "sequence":
        setCurrentSongIndex(
          (prevIndex: number) =>
            (prevIndex - 1 + playlist.length) % playlist.length
        );
        break;
      case "loop":
        if (audioRef.current) {
          audioPlay(audioRef.current);
        }
        break;
      case "shuffle":
        let nextIndex,
          currentIndex = currentSongIndex;
        do {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } while (playlist.length > 1 && nextIndex === currentIndex);
        setCurrentSongIndex(nextIndex);
        break;
      default:
        console.log(`Unsupported play mode: ${playMode}`);
    }
  };

  const audioPlay = (audio: HTMLAudioElement) => {
    audio.play().catch((error) => {
      if (error.name === "AbortError") {
        console.log("Play() was interrupted");
      } else {
        console.error("Error occurred while playing the video:", error);
      }
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", stopDrag);

    return () => {
      document.removeEventListener("mousemove", onDragging);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [isDragging]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updateProgress = () => {
      if (!isDragging) {
        const progress = audio.currentTime / audio.duration;
        setCurrentTime(audio.currentTime);
        setProgress(isNaN(progress) ? 0 : progress);
      }
    };

    const setAudioDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("durationchange", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("durationchange", setAudioDuration);
    };
  }, [isDragging]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updateCurrentLine = () => {
      if (!audio.duration) return;
      const lineDuration = audio.duration / splitLyrics.length;
      const currentLineIndex = Math.floor(audio.currentTime / lineDuration);
      setCurrentLine(currentLineIndex);
    };

    const intervalId = setInterval(updateCurrentLine, 500);

    return () => clearInterval(intervalId);
  }, [splitLyrics.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleSongEnd = () => {
      playNext();
    };

    audio.addEventListener("ended", handleSongEnd);

    return () => {
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [currentSongIndex, playMode]);

  useEffect(() => {
    if (
      !playlist ||
      playlist.length === 0 ||
      playlist.length - 1 < currentSongIndex
    ) {
      return;
    }

    setCurrentSong(playlist[currentSongIndex]);
  }, [currentSongIndex]);

  useEffect(() => {
    if (currentSong) {
      const lyrics = currentSong.lyrics ? currentSong.lyrics.split("\n") : [];
      setSplitLyrics(lyrics);
      setSong(currentSong);
      fetchFavoriteSong(currentSong.uuid);
    }
  }, [currentSong]);

  useEffect(() => {
    if (!song || !song.audio_url) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updateProgress = () => {
      if (!isDragging) {
        const progress = audio.currentTime / audio.duration;
        setCurrentTime(audio.currentTime);
        setProgress(isNaN(progress) ? 0 : progress);
      }
    };

    const setAudioDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("durationchange", setAudioDuration);

    setIsPlaying(true);
    audio.src = song.audio_url;
    audioPlay(audio);

    updatePlaySong(song.uuid);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("durationchange", setAudioDuration);
    };
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    // audio.play();
  }, [audioRef.current]);

  useEffect(() => {}, []);

  return (
    <>
      {song && (
        <div
          className={`fixed inset-x-0 ${
            isFullScreen ? "top-0 bottom-0" : "bottom-0"
          } bg-base-200 text-base-content transition-all duration-300`}
        >
          {/* {splitLyrics.map((line, index) => (
        <p
          key={index}
          style={{ color: index === currentLine ? "red" : "black" }}
        >
          {line}
        </p>
      ))} */}
          <audio src={song.audio_url} ref={audioRef} />

          <div
            className="w-full relative mx-0"
            ref={progressBarRef}
            onClick={changeProgress}
            onMouseDown={startDrag}
          >
            <div className="bg-base-300 rounded h-1 cursor-pointer">
              <div
                className="bg-primary h-1 rounded"
                style={{ width: `${progress * 100}%` }}
              ></div>
              <div
                className="absolute top-1/2 -mt-1"
                style={{ left: `calc(${progress * 100}% - 8px)` }}
              >
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4">
            <div
              className="flex items-center gap-x-2 cursor-pointer"
              onClick={() => router.push(`/song/${song.uuid}`)}
            >
              {song.image_url && (
                <Image
                  src={song.image_url}
                  width={48}
                  height={48}
                  alt={song.title || ""}
                  className="rounded-md"
                />
              )}
              <div className="text-sm w-[120px] md:w-[1/3] mt-0.5 truncate">
                <p className="font-medium truncate">{song.title} </p>

                <p className="">
                  {formatTime(currentTime)} / {formatTime(duration)}
                  <span
                    className={`badge ml-1 ${
                      song.provider === "udio"
                        ? "bg-red-500 text-white"
                        : "bg-primary"
                    }`}
                  >
                    {song.provider}
                  </span>
                </p>
              </div>
            </div>

            <div className="mx-2 md:mx-8 flex items-center text-slate-500 gap-x-1 md:gap-x-4">
              <button onClick={toggleLike} className="">
                {isLiked ? (
                  <MdOutlineFavorite className="text-xl text-primary" />
                ) : (
                  <MdOutlineFavoriteBorder className="text-xl" />
                )}
              </button>

              <button onClick={playPrev} className="">
                <MdOutlineSkipPrevious className="text-3xl text-primary" />
              </button>

              <button
                onClick={togglePlay}
                className="p-1 bg-primary rounded-full text-neutral"
              >
                {isPlaying ? (
                  <MdOutlinePause className="text-3xl" />
                ) : (
                  <MdOutlinePlayArrow className="text-3xl" />
                )}
              </button>

              <button onClick={playNext} className="">
                <MdOutlineSkipNext className="text-3xl text-primary" />
              </button>

              <button onClick={togglePlayMode} className="">
                {playMode === "sequence" ? (
                  <MdFormatListNumbered className="text-xl" />
                ) : playMode === "shuffle" ? (
                  <MdShuffle className="text-xl" />
                ) : (
                  <MdOutlineRepeatOne className="text-xl" />
                )}
              </button>
            </div>

            <div className="hidden md:flex items-center">
              <button className="mx-2">
                <Share song={song} />
              </button>

              <button className="mx-2" onClick={() => setVolume(0)}>
                <AiOutlineSound className="text-xl" />
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="volume-slider mx-2 appearance-none"
                style={
                  {
                    "--filled-percentage": `${volume * 100}%`,
                  } as React.CSSProperties
                }
              />

              {/* <button onClick={toggleFullScreen} className="mx-2">
            {isFullScreen ? <span>折叠图标</span> : <span>全屏图标</span>}
          </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
