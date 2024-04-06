"use client";

import { MdLocalFireDepartment, MdOutlineRssFeed } from "react-icons/md";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getLatestSongs, getTrendingSongs } from "@/models/song";
import { useEffect, useState } from "react";

import Image from "next/image";
import List from "../_components/song/list";
import { PiPlaylistDuotone } from "react-icons/pi";
import { Song } from "@/types/song";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("nav");
  const [trendingSongs, setTrendingSongs] = useState<Song[] | null>(null);
  const [latestSongs, setLatestSongs] = useState<Song[] | null>(null);

  const fetchTrendingSongs = async function (page: number, limit: number) {
    try {
      const uri = `/api/get-trending-songs`;
      const params = {
        page,
        limit,
      };
      const resp = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const { data } = await resp.json();
      setTrendingSongs(data || []);
    } catch (e) {
      console.log("fetch trending songs failed:");
    }
  };

  const fetchLatestSongs = async function (page: number, limit: number) {
    try {
      const uri = `/api/get-latest-songs`;
      const params = {
        page,
        limit,
      };
      const resp = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const { data } = await resp.json();
      setLatestSongs(data || []);
    } catch (e) {
      console.log("fetch trending songs failed:");
    }
  };

  useEffect(() => {
    fetchTrendingSongs(1, 50);
    fetchLatestSongs(1, 50);
  }, []);

  return (
    <div className="w-full md:max-w-6xl mx-auto">
      {/* <div>
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-x-2">
          <PiPlaylistDuotone />
          {t("playlists")}
        </h2>
        {trendingSongs && (
          <ScrollArea className="whitespace-nowrap mt-4">
            <div className="flex w-max space-x-4 p-4">
              {trendingSongs.map((song: Song) => {
                if (!song.title || !song.image_url) {
                  return;
                }
                return (
                  <figure
                    key={song.uuid}
                    className="w-28 overflow-hidden shrink-0 truncate cursor-pointer"
                  >
                    <div className="overflow-hidden rounded-md">
                      <Image
                        src={song.image_url}
                        alt={song.title}
                        className="h-fit w-fit object-cover"
                        width={128}
                        height={128}
                      />
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
      </div> */}

      <div className="mt-8 flex items-start flex-wrap">
        <div className="w-full md:w-1/2 pr-8">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-x-1">
            <MdLocalFireDepartment />
            {t("trending")}
          </h2>
          <ScrollArea className="h-[70vh] mt-4">
            <div className="p-4">
              {trendingSongs && <List songs={trendingSongs} />}
            </div>
          </ScrollArea>
        </div>
        <div className="w-full md:w-1/2 px-8">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-x-1">
            <MdOutlineRssFeed />
            {t("newest")}
          </h2>
          <ScrollArea className="h-[70vh] mt-4">
            <div className="p-4">
              {latestSongs && <List songs={latestSongs} />}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
