import { QueryResult, QueryResultRow } from "pg";

import { Song } from "@/types/song";
import { SongTask } from "@/types/task";
import { getDb } from "@/models/db";
import { getSongsFromSqlResult } from "./song";

export async function insertSongTask(task: SongTask) {
  const db = await getDb();
  const res = await db.query(
    `INSERT INTO song_tasks 
      (uuid, user_uuid, created_at, updated_at, status, description, title, lyrics, tags, is_no_lyrics, lyrics_provider, lyrics_uuid, song_provider, song_model, song_uuids) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  `,
    [
      task.uuid,
      task.user_uuid,
      task.created_at,
      task.updated_at,
      task.status,
      task.description,
      task.title as any,
      task.lyrics,
      task.tags,
      task.is_no_lyrics,
      task.lyrics_provider,
      task.lyrics_uuid,
      task.song_provider,
      task.song_model,
      task.song_uuids,
    ]
  );

  return res;
}

export async function getUserSongTasksCount(
  user_uuid: string
): Promise<number> {
  const db = getDb();
  const res = await db.query(
    `SELECT count(1) as count FROM song_tasks WHERE user_uuid = $1`,
    [user_uuid]
  );
  if (res.rowCount === 0) {
    return 0;
  }

  const { rows } = res;
  const row = rows[0];

  return row.count;
}

export async function updateSongTask(task: SongTask) {
  const db = await getDb();
  const res = await db.query(
    `UPDATE song_tasks SET 
      updated_at=$1,
      description=$2,
      title=$3,
      lyrics=$4,
      tags=$5,
      is_no_lyrics=$6,
      song_provider=$7,
      song_model=$8,
      song_uuids=$9,
      status=$10
    WHERE uuid=$11
  `,
    [
      task.updated_at,
      task.description,
      task.title as any,
      task.lyrics,
      task.tags,
      task.is_no_lyrics,
      task.song_provider,
      task.song_model,
      task.song_uuids,
      task.status,
      task.uuid,
    ]
  );

  return res;
}

export async function findSongTaskByUuid(
  uuid: string
): Promise<SongTask | undefined> {
  const db = getDb();
  const res = await db.query(
    `SELECT * FROM song_tasks WHERE uuid = $1 LIMIT 1`,
    [uuid]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  const { rows } = res;

  return formatSongTask(rows[0]);
}

export async function getUserSongTasks(
  user_uuid: string,
  page: number,
  limit: number
): Promise<SongTask[] | undefined> {
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const db = getDb();
  const res = await db.query(
    `SELECT * FROM song_tasks WHERE user_uuid = $1 order by created_at desc limit $2 offset $3`,
    [user_uuid as any, limit, offset]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  return getSongTasksFromSqlResult(res);
}

export async function getUserCreatedSongs(
  user_uuid: string,
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  try {
    if (page <= 0) {
      page = 1;
    }
    if (limit <= 0) {
      limit = 50;
    }
    const offset = (page - 1) * limit;

    const db = getDb();
    const res = await db.query(
      `SELECT * FROM song_tasks WHERE user_uuid = $1 order by created_at desc limit $2 offset $3`,
      [user_uuid as any, limit, offset]
    );
    if (res.rowCount === 0) {
      return undefined;
    }

    let song_uuids: string[] = [];
    res.rows.forEach((item) => {
      if (item["song_uuids"]) {
        const uuids = JSON.parse(item["song_uuids"]);
        song_uuids.push(...uuids);
      }
    });

    console.log("song_uuids", song_uuids);

    const placeholders = song_uuids
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    const song_res = await db.query(
      `SELECT * FROM songs WHERE uuid IN (${placeholders}) AND status not in ('forbidden','deleted') order by created_at desc`,
      song_uuids
    );

    return getSongsFromSqlResult(song_res);
  } catch (e) {
    console.log("get user created songs failed:", e);
    return [];
  }
}

export function getSongTasksFromSqlResult(
  res: QueryResult<QueryResultRow>
): SongTask[] {
  if (!res.rowCount || res.rowCount === 0) {
    return [];
  }

  const tasks: SongTask[] = [];
  const { rows } = res;
  rows.forEach((row) => {
    const task = formatSongTask(row);
    if (task) {
      tasks.push(task);
    }
  });

  return tasks;
}

export function formatSongTask(row: QueryResultRow): SongTask {
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
