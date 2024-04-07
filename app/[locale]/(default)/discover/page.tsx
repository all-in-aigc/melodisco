"use client";

import {
  MdLocalFireDepartment,
  MdOutlineRadio,
  MdOutlineRssFeed,
} from "react-icons/md";
import { useEffect, useState } from "react";

import Scroll from "../_components/playlist/scroll";
import { Song } from "@/types/song";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("nav");

  const [trendingSongs, setTrendingSongs] = useState<Song[] | null>(null);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [latestSongs, setLatestSongs] = useState<Song[] | null>(null);
  const [latestLoading, setLatestLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [randomSongs, setRandomSongs] = useState<Song[] | null>(null);

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

  const fetchRandomSongs = async function (page: number, limit: number) {
    try {
      const uri = `/api/get-random-songs`;
      const params = {
        page,
        limit,
      };

      setRandomLoading(true);
      const resp = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      setRandomLoading(false);

      const { data } = await resp.json();
      setRandomSongs(data || []);
    } catch (e) {
      setRandomLoading(false);
      console.log("fetch random songs failed:");
    }
  };

  useEffect(() => {
    fetchTrendingSongs(1, 50);
    fetchLatestSongs(1, 50);
    fetchRandomSongs(1, 50);
  }, []);

  return (
    <div className="w-full md:max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-x-2">
          <MdLocalFireDepartment />
          {t("trending")}
        </h2>
        <Scroll loading={trendingLoading} songs={trendingSongs} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-x-2">
          <MdOutlineRssFeed />
          {t("newest")}
        </h2>
        <Scroll loading={latestLoading} songs={latestSongs} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-x-2">
          <MdOutlineRadio />
          {t("roaming")}
        </h2>
        <Scroll loading={randomLoading} songs={randomSongs} />
      </div>
    </div>
  );
}
