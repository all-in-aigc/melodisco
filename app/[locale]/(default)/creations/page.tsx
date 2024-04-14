"use client";

import { useEffect, useState } from "react";

import Playlist from "../_components/playlist";
import Sign from "../_components/sign";
import { Song } from "@/types/song";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export const maxDuration = 120;

export default function () {
  const t = useTranslations("");

  const { user } = useAppContext();
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNeedReload, setIsNeedReload] = useState(false);
  const [reloadUuids, setReloadUuids] = useState<string[]>([]);

  const fetchCreatedSongs = async function (page: number) {
    try {
      const params = {
        page: page,
        limit: 50,
      };

      setLoading(true);
      const resp = await fetch("/api/get-created-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      setLoading(false);

      const { data } = await resp.json();

      let _needReload = false;
      let _reloadUuids: string[] = [];

      if (data) {
        for (let i = 0, l = data.length; i < l; i++) {
          if (data[i] && data[i].status !== "complete") {
            _needReload = true;
            _reloadUuids.push(data[i].uuid);
          }
        }
      }

      setIsNeedReload(_needReload);
      setReloadUuids(_reloadUuids);
      setSongs(data || []);
    } catch (e) {
      setLoading(false);
      console.log("fetch created songs failed:", e);
    }
  };

  const fetchSongs = async function (uuids: string[]) {
    console.log("fetch songs", uuids);

    try {
      const params = {
        uuids: uuids,
      };

      const resp = await fetch("/api/fetch-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const { data } = await resp.json();

      let _needReload = false;
      let _reloadUuids: string[] = [];

      if (data) {
        for (let i = 0, l = data.length; i < l; i++) {
          if (data[i] && data[i].status !== "complete") {
            _needReload = true;
            _reloadUuids.push(data[i].uuid);
          }
        }
      }

      setIsNeedReload(_needReload);
      setReloadUuids(_reloadUuids);
      if (_reloadUuids.length !== reloadUuids.length) {
        fetchCreatedSongs(1);
      }
    } catch (e) {
      console.log("fetch songs failed:", e);
    }
  };

  useEffect(() => {
    fetchCreatedSongs(1);
  }, [user]);

  useEffect(() => {
    console.log("need reload", isNeedReload);
    if (isNeedReload) {
      const intervalId = setInterval(() => {
        fetchSongs(reloadUuids);
      }, 3000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isNeedReload]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("nav.creations")}
          </h1>
          <p className="text-sm text-muted-foreground"></p>
        </div>
      </div>

      {user ? (
        <Playlist loading={isNeedReload ? false : loading} songs={songs} />
      ) : (
        <Sign />
      )}
    </div>
  );
}
