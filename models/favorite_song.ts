import { FavoriteSong, Song } from "@/types/song";

import { getSongsFromSqlResult } from "./song";
import { getSupabaseClient } from "./db";

export async function insertFavoriteSong(song: FavoriteSong) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("favorite_songs").insert({
    song_uuid: song.song_uuid,
    user_uuid: song.user_uuid,
    created_at: song.created_at,
    updated_at: song.updated_at,
    status: song.status,
  });

  if (error) throw error;
  return data;
}

export async function updateFavoriteSong(song: FavoriteSong) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("favorite_songs")
    .update({
      status: song.status,
      updated_at: song.updated_at,
    })
    .eq("song_uuid", song.song_uuid)
    .eq("user_uuid", song.user_uuid);

  if (error) throw error;
  return data;
}

export async function findFavoriteSong(
  song_uuid: string,
  user_uuid: string
): Promise<FavoriteSong | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("favorite_songs")
    .select("*")
    .eq("song_uuid", song_uuid)
    .eq("user_uuid", user_uuid)
    .limit(1)
    .single();

  if (error) return undefined;
  return formatFavoriteSong(data);
}

export async function getUserFavoriteSongs(
  user_uuid: string,
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  const supabase = getSupabaseClient();
  if (page < 1) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const { data, error } = await supabase.rpc("get_user_favorite_songs", {
    user_uuid,
    results_limit: limit,
    results_offset: offset,
  });

  if (error) return undefined;
  return getSongsFromSqlResult({ rows: data });
}

export function formatFavoriteSong(row: any): FavoriteSong {
  const favoriteSong: FavoriteSong = {
    song_uuid: row.song_uuid,
    user_uuid: row.user_uuid,
    created_at: row.created_at,
    updated_at: row.updated_at,
    status: row.status,
  };

  return favoriteSong;
}
