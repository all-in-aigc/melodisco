import { QueryResultRow } from "pg";
import { SongTask } from "@/types/task";
import { getDb } from "@/models/db";

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
