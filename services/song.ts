import { getLatestSongs, getTrendingSongs } from "./suno";
import { getUuids, insertRow } from "@/models/song";

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

export async function updateSongs(allSongs: Song[]) {
  const uuids = await getUuids();
  const allSongsCount = allSongs.length;

  console.log(
    `update songs count: ${allSongsCount}, exist songs count: ${uuids.length}`
  );

  let existCount = 0;
  let newCount = 0;
  let failedCount = 0;
  for (let i = 0; i < allSongsCount; i++) {
    const song = allSongs[i];
    if (!song.uuid) {
      continue;
    }

    if (uuids && uuids.includes(song.uuid)) {
      console.log("song exist: ", song.uuid, song.audio_url);
      existCount += 1;
      continue;
    }

    try {
      await insertRow(song);
      newCount += 1;
      console.log(
        "insert new songs: ",
        song.uuid,
        song.audio_url,
        i,
        allSongsCount - i
      );
    } catch (e) {
      failedCount += 1;
      console.log("insert song failed: ", song.uuid, song.audio_url, i, e);
    }
  }

  return {
    all_count: allSongsCount,
    exist_count: existCount,
    new_count: newCount,
    failed_count: failedCount,
  };
}

export function formatSong(
  v: any,
  is_trending: boolean,
  provider?: string
): Song {
  if (provider === "udio") {
    const song: Song = {
      uuid: v["id"],
      video_url: v["video_path"],
      audio_url: v["song_path"],
      image_url: v["image_path"],
      image_large_url: v["image_path"],
      llm_model: "udio-beta",
      tags: v["tags"].join(","),
      lyrics: v["lyrics"],
      description: v["prompt"],
      duration: v["duration"],
      type: "",
      user_uuid: v["user_id"],
      title: v["title"],
      play_count: v["plays"],
      upvote_count: v["likes"],
      created_at: v["created_at"],
      status: v["finished"] ? "complete" : "",
      is_public: v["published_at"] ? true : false,
      is_trending: is_trending,
      provider: provider,
      artist: v["artist"],
      prompt: v["optimized_prompt"],
    };
    return song;
  }

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
    provider: provider,
  };

  return song;
}

export const styles = [
  {
    label: "rock",
    value: "rock",
  },
  {
    label: "electronic",
    value: "electronic",
  },
  {
    label: "pop",
    value: "pop",
  },
  {
    label: "jazz",
    value: "jazz",
  },
  {
    label: "classical",
    value: "classical",
  },
  {
    label: "hip hop",
    value: "hip hop",
  },
  {
    label: "pop rock",
    value: "pop rock",
  },
  {
    label: "indie rock",
    value: "indie rock",
  },
  {
    label: "alternative rock",
    value: "alternative rock",
  },
  {
    label: "folk",
    value: "folk",
  },
  {
    label: "punk",
    value: "punk",
  },
  {
    label: "blues",
    value: "blues",
  },
  {
    label: "experimental",
    value: "experimental",
  },
  {
    label: "ambient",
    value: "ambient",
  },
  {
    label: "synth-pop",
    value: "synth-pop",
  },
  {
    label: "hard rock",
    value: "hard rock",
  },
  {
    label: "downtempo",
    value: "downtempo",
  },
  {
    label: "heavy metal",
    value: "heavy metal",
  },
  {
    label: "house",
    value: "house",
  },
  {
    label: "electro",
    value: "electro",
  },
  {
    label: "soul",
    value: "soul",
  },
  {
    label: "country",
    value: "country",
  },
  {
    label: "folk rock",
    value: "folk rock",
  },
  {
    label: "melodic",
    value: "melodic",
  },
  {
    label: "latin",
    value: "latin",
  },
];
