import { Song } from "@/types/song";
import { getSupabaseClient } from "./db";

export async function insertRow(song: Song) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("songs").insert([song]).select();

  if (error) throw error;
  return data;
}

export async function updateSong(song: Song) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .update(song)
    .eq("uuid", song.uuid)
    .select();

  if (error) throw error;
  return data;
}

export async function getUuids(): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("songs").select("uuid");

  if (error) throw error;
  return data?.map((row) => row.uuid) || [];
}

export async function getTotalCount(): Promise<number> {
  const supabase = getSupabaseClient();
  const { count, error } = await supabase
    .from("songs")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count || 0;
}

export async function findByUuid(uuid: string): Promise<Song | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) throw error;
  return data ? formatSong(data) : undefined;
}

export async function getLatestSongs(
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("status", "complete")
    .neq("audio_url", "")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data ? getSongsFromSqlResult({ rows: data }) : undefined;
}

export async function getProviderLatestSongs(
  provider: string,
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("provider", provider)
    .eq("status", "complete")
    .neq("audio_url", "")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data ? getSongsFromSqlResult({ rows: data }) : undefined;
}

export async function getRandomSongs(
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_random_songs", {
    provider_param: null,
    page,
    results_limit: limit,
  });

  if (error) throw error;
  return data ? getSongsFromSqlResult({ rows: data }) : undefined;
}

export async function getProviderRandomSongs(
  provider: string,
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_random_songs", {
    provider_param: provider,
    page,
    results_limit: limit,
  });

  if (error) throw error;
  return data ? getSongsFromSqlResult({ rows: data }) : undefined;
}

export async function getTrendingSongs(
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("status", "complete")
    .neq("audio_url", "")
    .order("play_count", { ascending: false })
    .order("upvote_count", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data ? getSongsFromSqlResult({ rows: data }) : undefined;
}

export async function getProviderTrendingSongs(
  provider: string,
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("provider", provider)
    .eq("status", "complete")
    .neq("audio_url", "")
    .order("play_count", { ascending: false })
    .order("upvote_count", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data ? getSongsFromSqlResult({ rows: data }) : undefined;
}

export async function getUserSongs(
  user_uuid: string,
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_uuid", user_uuid)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data ? getSongsFromSqlResult({ rows: data }) : undefined;
}

export function getSongsFromSqlResult(res: any): Song[] {
  const { rows } = res;
  return rows
    .map(formatSong)
    .filter(
      (song: any): song is Song =>
        song !== undefined && song.status !== "forbidden"
    );
}

export async function increasePlayCount(song_uuid: string) {
  const supabase = getSupabaseClient();

  // First, get the current play count
  const { data: currentData, error: fetchError } = await supabase
    .from("songs")
    .select("play_count")
    .eq("uuid", song_uuid)
    .single();

  if (fetchError) throw fetchError;

  if (!currentData) {
    throw new Error("Song not found");
  }

  const newPlayCount = (currentData.play_count || 0) + 1;

  // Then, update the play count
  const { data, error } = await supabase
    .from("songs")
    .update({ play_count: newPlayCount })
    .eq("uuid", song_uuid);

  if (error) throw error;
  return data;
}

export function isSongSensitive(song: Song): boolean {
  const sensitiveKeywords = process.env.SENSITIVE_KEYWORDS || "";
  const keywordsArr = sensitiveKeywords.split(",");
  for (let i = 0, l = keywordsArr.length; i < l; i++) {
    const keyword = keywordsArr[i].trim();
    if (!keyword) {
      continue;
    }
    if (
      (song.title && song.title.includes(keyword)) ||
      (song.description && song.description.includes(keyword)) ||
      (song.tags && song.tags.includes(keyword)) ||
      (song.lyrics && song.lyrics.includes(keyword))
    ) {
      console.log("song is sensitive: ", song.uuid, song.title, keyword);
      return true;
    }
  }

  return false;
}

export function formatSong(row: any): Song | undefined {
  let song: Song = {
    uuid: row.uuid,
    video_url: row.video_url,
    audio_url: row.audio_url,
    image_url: row.image_url,
    image_large_url: row.image_large_url,
    llm_model: row.llm_model,
    tags: row.tags,
    lyrics: row.lyrics,
    description: row.description,
    duration: row.duration,
    type: row.type,
    user_uuid: row.user_uuid,
    title: row.title,
    play_count: row.play_count,
    upvote_count: row.upvote_count,
    created_at: row.created_at,
    status: row.status,
    is_public: row.is_public,
    is_trending: row.is_trending,
    provider: row.provider,
    artist: row.artist,
    prompt: row.prompt,
  };

  if (!song.image_url) {
    song.image_url = "/cover.png";
    song.image_large_url = "/cover.png";
  }

  if (isSongSensitive(song)) {
    song.status = "forbidden";
  }

  return song;
}
