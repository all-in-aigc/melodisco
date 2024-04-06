import { getLatestSongs, getTrendingSongs } from "./suno";

import { Song } from "@/types/song";
import fs from "fs";

export const getSongsFromFile = async (): Promise<Song[]> => {
  try {
    const dataFile = process.env.SUNO_SONGS_FILE;
    if (!dataFile) {
      return [];
    }

    const data = fs.readFileSync(dataFile, "utf8");
    const jsonData = JSON.parse(data);

    let songs: Song[] = [];
    jsonData.map((v: any) => {
      const song = formatSong(v, false);
      if (song) {
        songs.push(song);
      }
    });

    return songs;
  } catch (err) {
    console.error("load songs file failed:", err);
    return [];
  }
};

export async function getSunoTrendingSongs(page: number): Promise<Song[]> {
  try {
    const data = await getTrendingSongs(page);

    const songs: Song[] = [];

    data["playlist_clips"].forEach((v: any) => {
      const song: Song = formatSong(v["clip"], true);
      songs.push(song);
    });

    return songs;
  } catch (e) {
    console.log("get trending songs failed:", e);
    return [];
  }
}

export async function getSunoLatestSongs(page: number): Promise<Song[]> {
  try {
    const data = await getLatestSongs(page);

    const songs: Song[] = [];

    data["playlist_clips"].forEach((v: any) => {
      const song: Song = formatSong(v["clip"], false);
      songs.push(song);
    });

    return songs;
  } catch (e) {
    console.log("get trending songs failed:", e);
    return [];
  }
}

export function formatSong(v: any, is_trending: boolean): Song {
  const song: Song = {
    uuid: v["id"],
    video_url: v["video_url"],
    audio_url: v["audio_url"],
    image_url: v["image_url"],
    image_large_url: v["image_large_url"],
    llm_model: v["model_name"],
    tags: v["metadata"]["tags"],
    lyrics: v["metadata"]["prompt"],
    description: v["metadata"]["gpt_description_prompt"],
    duration: v["metadata"]["duration"],
    type: v["metadata"]["type"],
    user_uuid: v["user_id"],
    title: v["title"],
    play_count: v["play_count"],
    upvote_count: v["upvote_count"],
    created_at: v["created_at"],
    status: v["status"],
    is_public: v["is_public"],
    is_trending: is_trending,
  };

  return song;
}
