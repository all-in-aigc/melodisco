"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Image from "next/image";
import Link from "next/link";
import Skeleton from "../skeleton";
import { Song } from "@/types/song";
import { useAppContext } from "@/contexts/app";

export default function ({
  loading,
  songs,
}: {
  loading: boolean;
  songs: Song[] | null;
}) {
  const { setPlaylist, currentSong, setCurrentSong, setCurrentSongIndex } =
    useAppContext();

  const updatePlaylist = function (song: Song, idx: number) {
    if (!songs) {
      return;
    }
    setPlaylist(
      songs.filter(
        (item: Song) => item && item.audio_url && item.title && item.image_url
      )
    );
    setCurrentSong(song);
    setCurrentSongIndex(idx);
  };

  return (
    <>
      {loading || songs === null ? (
        <div className="flex mt-8 gap-x-4">
          <Skeleton />
        </div>
      ) : (
        <ScrollArea className="w-96 md:w-full whitespace-nowrap mt-4">
          <div className="flex w-max space-x-4 p-4">
            {songs
              .filter(
                (item: Song) =>
                  item && item.audio_url && item.title && item.image_url
              )
              .map((song: Song, idx: number) => {
                const isActive = currentSong && currentSong.uuid === song.uuid;
                return (
                  <figure
                    key={song.uuid}
                    className="w-28 overflow-hidden shrink-0 truncate cursor-pointer"
                    onClick={() => updatePlaylist(song, idx)}
                  >
                    <div className="overflow-hidden rounded-md relative">
                      <Image
                        src={song.image_url || "/cover.png"}
                        alt={song.title || ""}
                        className={`h-fit w-fit object-cover ${
                          isActive ? "opacity-[0.3]" : ""
                        }`}
                        width={128}
                        height={128}
                      />
                      {isActive ? (
                        <img
                          className="absolute top-12 left-12"
                          src="/playing.gif"
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                    <figcaption className="pt-2 text-xs text-base-content truncate">
                      <Link
                        href={`/song/${song.uuid}`}
                        className="font-semibold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {song.title}
                      </Link>
                    </figcaption>
                  </figure>
                );
              })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </>
  );
}
