"use client";

import { useEffect, useState } from "react";

import Playlist from "../_components/playlist";
import Sign from "../_components/sign";
import { Song } from "@/types/song";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("nav");

  const { user } = useAppContext();
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSongs = async function (page: number) {
    try {
      const params = {
        page: page,
        limit: 50,
      };

      setLoading(true);
      const resp = await fetch("/api/get-favorite-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      setLoading(false);

      const { data } = await resp.json();
      setSongs(data || []);
    } catch (e) {
      setLoading(false);
      console.log("fetch favorite songs failed:", e);
    }
  };

  useEffect(() => {
    fetchSongs(1);
  }, [user]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("favorites")}
          </h1>
          <p className="text-sm text-muted-foreground"></p>
        </div>
      </div>

      {user ? <Playlist loading={loading} songs={songs} /> : <Sign />}
    </div>
  );
}
