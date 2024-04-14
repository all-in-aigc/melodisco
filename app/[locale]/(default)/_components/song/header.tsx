"use client";

import { MdHeadset, MdOutlinePlayArrow } from "react-icons/md";

import { AiOutlineLike } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Share from "../share";
import { Song } from "@/types/song";
import moment from "moment";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function ({ song }: { song: Song }) {
  const t = useTranslations("song");

  const { appendPlaylist, currentSong, setCurrentSong, setCurrentSongIndex } =
    useAppContext();

  const playSong = function (song: Song) {
    appendPlaylist(song);
    setCurrentSong(song);
    setCurrentSongIndex(0);
  };

  return (
    <div className="flex items-center gap-x-8 border-b border-base-300 pb-8">
      {song.image_url && (
        <Image
          src={song.image_url}
          alt={song.title || ""}
          width={160}
          height={160}
          className="hidden md:block rounded-lg"
        />
      )}

      <div className="flex flex-col gap-y-2 mr-8">
        <h1 className="text-xl font-medium">{song.title || "No Title"}</h1>
        <p className="text-md">{song.tags}</p>
        <p className="text-md">
          {moment(song.created_at).format("MMMM Do, YYYY")}
          <span
            className={`badge ml-1 ${
              song.provider === "udio" ? "bg-red-500 text-white" : "bg-primary"
            }`}
          >
            {song.provider}
          </span>
        </p>

        <div className="mt-2 flex gap-x-2 md:gap-x-4 text-md text-base-content">
          {currentSong && currentSong.uuid === song.uuid ? (
            <Button
              size="sm"
              className="flex items-center gap-x-1 w-20 bg-base-300"
            >
              <img src="/playing.gif" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="flex items-center gap-x-1 w-20 truncate"
              onClick={() => playSong(song)}
            >
              <MdOutlinePlayArrow className="text-2xl" />
              {t("play")}
            </Button>
          )}
          <Button
            size="sm"
            className="flex items-center gap-x-1 bg-base-300 text-base-content"
          >
            <MdHeadset className="text-xl" />
            {song.play_count}
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-x-1 bg-base-300 text-base-content"
          >
            <AiOutlineLike className="text-xl" />
            {song.upvote_count}
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-x-1 bg-base-300 text-base-content"
          >
            <Share song={song} />
          </Button>
          {/* <Button
            size="sm"
            className="hidden md:flex items-center gap-x-1 bg-base-300 text-base-content"
          >
            <MdOutlineDownload className="text-2xl" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
