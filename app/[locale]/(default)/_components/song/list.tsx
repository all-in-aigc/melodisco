"use client";

import Image from "next/image";
import Link from "next/link";
import { Song } from "@/types/song";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";

export default function ({ songs }: { songs: Song[] }) {
  const router = useRouter();

  const { currentSong, appendPlaylist, setCurrentSong, setCurrentSongIndex } =
    useAppContext();

  const playSong = function (song: Song) {
    appendPlaylist(song);
    setCurrentSong(song);
    setCurrentSongIndex(0);
    router.push(`/song/${song.uuid}`);
  };

  return (
    <div>
      {songs
        .filter((item: Song) => item.title && item.image_url)
        .map((song: Song) => {
          const isActive = currentSong && currentSong.uuid === song.uuid;

          return (
            <div
              key={song.uuid}
              className="flex items-start gap-x-2 my-2 py-2 border-b border-base-200 overflow-hidden cursor-pointer relative"
              onClick={() => playSong(song)}
            >
              <Image
                src={song.image_url || "/cover.png"}
                width={60}
                height={60}
                alt={song.title || ""}
                className={`rounded-md h-fit w-fit object-cover ${
                  isActive ? "opacity-[0.3]" : ""
                }`}
              />
              {isActive ? (
                <img className="absolute top-8 left-6" src="/playing.gif" />
              ) : (
                <></>
              )}
              <div>
                <Link
                  href={`/song/${song.uuid}`}
                  className="truncate w-60 font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {song.title}
                </Link>
                <p className="truncate w-60">{song.tags}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
