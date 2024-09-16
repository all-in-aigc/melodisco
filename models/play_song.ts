import { PlaySong, Song } from "@/types/song";

import { getSongsFromSqlResult } from "./song";
import { getSupabaseClient } from "./db";

export async function insertPlaySong(song: PlaySong) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("play_songs").insert({
    song_uuid: song.song_uuid,
    user_uuid: song.user_uuid,
    created_at: song.created_at,
  });

  if (error) throw error;
  return data;
}

export async function getUserPlaySongs(
  user_uuid: string,
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  if (page < 1) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_user_play_songs", {
    user_uuid,
    results_limit: limit,
    results_offset: offset,
  });

  if (error) return undefined;

  return getSongsFromSqlResult({ rows: data });
}
