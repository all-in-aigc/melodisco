"use client";

import { useEffect, useState } from "react";

import Playlist from "../_components/playlist";
import { Song } from "@/types/song";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("nav");

  const [songs, setSongs] = useState<Song[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSongs = async function (page: number, limit: number) {
    try {
      const params = { page, limit };

      setLoading(true);
      const resp = await fetch("/api/get-trending-songs", {
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
      console.log("fetch songs failed:", e);
    }
  };

  useEffect(() => {
    fetchSongs(1, 50);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("trending")}
          </h2>
          <p className="text-sm text-muted-foreground"></p>
        </div>
      </div>

      <Playlist loading={loading} songs={songs} />
    </div>
  );
}
