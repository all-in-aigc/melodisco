import { MdHeadset, MdOutlineThumbUp } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import Skeleton from "../skeleton";
import { Song } from "@/types/song";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ({
  loading,
  songs,
}: {
  loading: boolean;
  songs: Song[] | null;
}) {
  const t = useTranslations("song");

  const router = useRouter();
  const { setPlaylist, currentSong, setCurrentSong, setCurrentSongIndex } =
    useAppContext();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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
        <>
          <Skeleton />
        </>
      ) : !songs ? (
        <>empty</>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-base-300 text-base-content">
              <TableHead>#</TableHead>
              <TableHead className="hidden sm:table-cell"></TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("tags")}</TableHead>
              <TableHead className="hidden md:table-cell">
                {t("duration")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs
              .filter((item: Song) => item.title && item.image_url)
              .map((song: Song, idx: number) => {
                const isActive = currentSong && currentSong.uuid === song.uuid;
                return (
                  <TableRow
                    key={idx}
                    className={`cursor-pointer border-base-200 hover:bg-base-200 ${
                      isActive ? "bg-base-300 rounded-xl" : ""
                    }`}
                    onClick={() => updatePlaylist(song, idx)}
                  >
                    <TableCell className="font-medium">
                      {isActive ? <img src="/playing.gif" /> : idx + 1}
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={song.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={song.image_url}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[120px] truncate">
                      <p
                        className="hover:underline truncate"
                        onClick={(e) => {
                          return;
                          e.stopPropagation();
                          router.push(`/song/${song.uuid}`);
                        }}
                      >
                        {song.title}
                      </p>
                      <div className="flex items-center gap-x-4 mt-1">
                        <div className="flex items-center gap-x-0.5">
                          <MdHeadset />
                          {song.play_count}
                        </div>
                        <div className="flex items-center gap-x-0.5">
                          <MdOutlineThumbUp />
                          {song.upvote_count}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-medium max-w-[120px] md:max-w-sm truncate">
                      {song.tags}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      {formatTime(song.duration)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      )}
    </>
  );
}
