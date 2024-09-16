import { Song } from "@/types/song";
import { SongTask } from "@/types/task";
import { getSongsFromSqlResult } from "./song";
import { getSupabaseClient } from "./db";

export async function insertSongTask(task: SongTask) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("song_tasks")
    .insert([
      {
        uuid: task.uuid,
        user_uuid: task.user_uuid,
        created_at: task.created_at,
        updated_at: task.updated_at,
        status: task.status,
        description: task.description,
        title: task.title,
        lyrics: task.lyrics,
        tags: task.tags,
        is_no_lyrics: task.is_no_lyrics,
        lyrics_provider: task.lyrics_provider,
        lyrics_uuid: task.lyrics_uuid,
        song_provider: task.song_provider,
        song_model: task.song_model,
        song_uuids: task.song_uuids,
      },
    ])
    .select();

  return { data, error };
}

export async function getUserSongTasksCount(
  user_uuid: string
): Promise<number> {
  const supabase = getSupabaseClient();
  const { count, error } = await supabase
    .from("song_tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_uuid", user_uuid);

  if (error) {
    console.error("Error getting song tasks count:", error);
    return 0;
  }

  return count || 0;
}

export async function updateSongTask(task: SongTask) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("song_tasks")
    .update({
      updated_at: task.updated_at,
      description: task.description,
      title: task.title,
      lyrics: task.lyrics,
      tags: task.tags,
      is_no_lyrics: task.is_no_lyrics,
      song_provider: task.song_provider,
      song_model: task.song_model,
      song_uuids: task.song_uuids,
      status: task.status,
    })
    .eq("uuid", task.uuid)
    .select();

  return { data, error };
}

export async function findSongTaskByUuid(
  uuid: string
): Promise<SongTask | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("song_tasks")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    console.error("Error finding song task:", error);
    return undefined;
  }

  return formatSongTask(data);
}

export async function getUserSongTasks(
  user_uuid: string,
  page: number,
  limit: number
): Promise<SongTask[] | undefined> {
  const supabase = getSupabaseClient();
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const { data, error } = await supabase
    .from("song_tasks")
    .select("*")
    .eq("user_uuid", user_uuid)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error getting user song tasks:", error);
    return undefined;
  }

  return data
    ? getSongTasksFromSqlResult({ rows: data, rowCount: data.length })
    : undefined;
}

export async function getUserCreatedSongs(
  user_uuid: string,
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  const supabase = getSupabaseClient();
  try {
    if (page <= 0) {
      page = 1;
    }
    if (limit <= 0) {
      limit = 50;
    }
    const offset = (page - 1) * limit;

    const { data: taskData, error: taskError } = await supabase
      .from("song_tasks")
      .select("song_uuids")
      .eq("user_uuid", user_uuid)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (taskError) {
      console.error("Error getting user song tasks:", taskError);
      return undefined;
    }

    let song_uuids: string[] = [];
    taskData.forEach((item) => {
      if (item.song_uuids) {
        const uuids = JSON.parse(item.song_uuids);
        song_uuids.push(...uuids);
      }
    });

    console.log("song_uuids", song_uuids);

    const { data: songData, error: songError } = await supabase
      .from("songs")
      .select("*")
      .in("uuid", song_uuids)
      .not("status", "in", '("forbidden","deleted")')
      .order("created_at", { ascending: false });

    if (songError) {
      console.error("Error getting songs:", songError);
      return undefined;
    }

    return getSongsFromSqlResult({ rows: songData, rowCount: songData.length });
  } catch (e) {
    console.log("get user created songs failed:", e);
    return [];
  }
}

export function getSongTasksFromSqlResult(res: any): SongTask[] {
  if (!res.rowCount || res.rowCount === 0) {
    return [];
  }

  const tasks: SongTask[] = [];
  const { rows } = res;
  rows.forEach((row: any) => {
    const task = formatSongTask(row);
    if (task) {
      tasks.push(task);
    }
  });

  return tasks;
}

export function formatSongTask(row: any): SongTask {
  const task: SongTask = {
    uuid: row.uuid,
    user_uuid: row.user_uuid,
    created_at: row.created_at,
    updated_at: row.updated_at,
    status: row.status,
    description: row.description,
    title: row.title,
    lyrics: row.lyrics,
    tags: row.tags,
    is_no_lyrics: row.is_no_lyrics,
    lyrics_provider: row.lyrics_provider,
    lyrics_uuid: row.lyrics_uuid,
    song_provider: row.song_provider,
    song_model: row.song_model,
    song_uuids: row.song_uuids,
  };

  return task;
}
