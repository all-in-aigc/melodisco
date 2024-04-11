"use client";

import { MdHeadset, MdOutlinePlayArrow } from "react-icons/md";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Skeleton from "../skeleton";
import { Song } from "@/types/song";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("song");

  const {
    songTask,
    currentSong,
    appendPlaylist,
    setCurrentSong,
    setCurrentSongIndex,
  } = useAppContext();
  const [songs, setSongs] = useState<Song[] | null>(null);

  const playSong = function (song: Song) {
    appendPlaylist(song);
    setCurrentSong(song);
    setCurrentSongIndex(0);
  };

  const fetchSongs = async function (uuids: string[]) {
    try {
      const params = {
        uuids: uuids,
      };

      const resp = await fetch("/api/fetch-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const { code, message, data } = await resp.json();

      setSongs(data || []);

      console.log("songs", data);
    } catch (e) {
      console.log("fetch song failed:", e);
    }
  };

  useEffect(() => {
    if (songTask && songTask.song_uuids) {
      const song_uuids = JSON.parse(songTask.song_uuids);
      if (song_uuids.length > 0) {
        fetchSongs(song_uuids);
      }
    }
  }, [songTask]);

  const SongUI = (song: Song) => {
    return (
      <div>
        <div className="mt-4 flex justify-center">
          <img src={song.image_url} alt="" className="w-40 h-40 rounded-md" />
        </div>

        <div className="text-center mt-4 font-bold hover:underline">
          {song.audio_url ? (
            <a href={`/song/${song.uuid}`} target="_blank">
              {song.title}
            </a>
          ) : (
            song.title
          )}
        </div>

        <div className="mt-4 text-center flex justify-center gap-x-3">
          {currentSong && currentSong.uuid === song.uuid ? (
            <Button
              size="sm"
              className="flex items-center gap-x-1 w-20 bg-base-300"
            >
              <img src="/playing.gif" />
            </Button>
          ) : (
            <>
              {song.audio_url ? (
                <Button
                  size="sm"
                  className="flex items-center gap-x-1 w-20 truncate"
                  onClick={() => playSong(song)}
                >
                  <MdOutlinePlayArrow className="text-2xl" />
                  {t("play")}
                </Button>
              ) : (
                <p>{song.status}</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto">
      {songs ? (
        <div className="flex items-center justify-center gap-x-16 ">
          {songs.map((song: Song, idx: number) => {
            return <div key={idx}>{SongUI(song)}</div>;
          })}
        </div>
      ) : (
        <>
          <Skeleton />
        </>
      )}
    </div>
  );
}
