"use client";

import { MdLocalFireDepartment, MdOutlineRssFeed } from "react-icons/md";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getLatestSongs, getTrendingSongs } from "@/models/song";
import { useEffect, useState } from "react";

import Image from "next/image";
import List from "../_components/song/list";
import { PiPlaylistDuotone } from "react-icons/pi";
import Skeleton from "../_components/skeleton";
import { Song } from "@/types/song";
import { getTranslations } from "next-intl/server";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("nav");

  const [trendingSongs, setTrendingSongs] = useState<Song[] | null>(null);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [latestSongs, setLatestSongs] = useState<Song[] | null>(null);
  const [latestLoading, setLatestLoading] = useState(false);

  const fetchTrendingSongs = async function (page: number, limit: number) {
    try {
      const uri = `/api/get-trending-songs`;
      const params = {
        page,
        limit,
      };

      setTrendingLoading(true);
      const resp = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      setTrendingLoading(false);

      const { data } = await resp.json();
      setTrendingSongs(data || []);
    } catch (e) {
      setTrendingLoading(false);
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

      setTrendingLoading(true);
      const resp = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      setTrendingLoading(false);

      const { data } = await resp.json();
      setLatestSongs(data || []);
    } catch (e) {
      setTrendingLoading(false);
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

      <div className="md:mt-8 flex items-start flex-wrap">
        <div className="w-full md:w-1/2 md:pr-8">
          <h2 className="text-2xl mb-4 font-semibold tracking-tight flex items-center gap-x-1">
            <MdLocalFireDepartment />
            {t("trending")}
          </h2>
          {trendingLoading || trendingSongs === null ? (
            <>
              <Skeleton />
            </>
          ) : (
            <ScrollArea className="h-[70vh]">
              <div className="p-4 max-w-sm truncate">
                {trendingSongs && <List songs={trendingSongs} />}
              </div>
            </ScrollArea>
          )}
        </div>
        <div className="w-full md:w-1/2 md:px-8 mt-8 md:mt-0">
          <h2 className="text-2xl mb-4 font-semibold tracking-tight flex items-center gap-x-1">
            <MdOutlineRssFeed />
            {t("newest")}
          </h2>
          {latestLoading || latestSongs === null ? (
            <>
              <Skeleton />
            </>
          ) : (
            <ScrollArea className="h-[70vh]">
              <div className="p-4 max-sm truncate">
                {latestSongs && <List songs={latestSongs} />}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
