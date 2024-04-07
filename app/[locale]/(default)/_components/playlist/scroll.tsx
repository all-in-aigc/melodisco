import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Image from "next/image";
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
    console.log("update playlists", song, songs);
    if (!songs) {
      return;
    }
    setPlaylist(songs);
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
        <ScrollArea className="whitespace-nowrap mt-4">
          <div className="flex w-max space-x-4 p-4">
            {songs
              .filter((item: Song) => item.title && item.image_url)
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
                        src={song.image_url}
                        alt={song.title}
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
                      <span className="font-semibold">{song.title}</span>
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
