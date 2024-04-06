import { QueryResult, QueryResultRow } from "pg";

import { Song } from "@/types/song";
import { getDb } from "@/models/db";

export async function insertRow(song: Song) {
  const db = getDb();
  const res = await db.query(
    `INSERT INTO songs 
  (uuid, video_url, audio_url, image_url, image_large_url, llm_model, tags, lyrics, description, duration, type, user_uuid, title, play_count, upvote_count, created_at, status, is_public, is_trending) 
  VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
`,
    [
      song.uuid,
      song.video_url,
      song.audio_url,
      song.image_url,
      song.image_large_url,
      song.llm_model,
      song.tags,
      song.lyrics,
      song.description,
      song.duration as any,
      song.type,
      song.user_uuid,
      song.title,
      song.play_count,
      song.upvote_count,
      song.created_at,
      song.status,
      song.is_public,
      song.is_trending,
    ]
  );

  return res;
}

export async function getUuids(): Promise<string[]> {
  const db = getDb();
  const res = await db.query(`SELECT uuid FROM songs`);
  if (res.rowCount === 0) {
    return [];
  }

  const { rows } = res;
  let uuids: string[] = [];
  rows.forEach((row) => {
    uuids.push(row.uuid);
  });

  return uuids;
}

export async function getTotalCount(): Promise<number> {
  const db = getDb();
  const res = await db.query(`SELECT count(1) as count FROM songs LIMIT 1`);
  if (res.rowCount === 0) {
    return 0;
  }

  const { rows } = res;
  const row = rows[0];

  return row.count;
}

export async function findByUuid(uuid: string): Promise<Song | undefined> {
  const db = getDb();
  const res = await db.query(`SELECT * FROM songs WHERE uuid = $1 LIMIT 1`, [
    uuid,
  ]);
  if (res.rowCount === 0) {
    return undefined;
  }

  const { rows } = res;

  return formatSong(rows[0]);
}

export async function getLatestSongs(
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const db = getDb();
  const res = await db.query(
    `SELECT * FROM songs order by created_at desc limit $1 offset $2`,
    [limit, offset]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  return getSongsFromSqlResult(res);
}

export async function getRandomSongs(
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const db = getDb();
  const res = await db.query(
    `SELECT * FROM songs order by random() limit $1 offset $2`,
    [limit, offset]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  return getSongsFromSqlResult(res);
}

export async function getTrendingSongs(
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const db = getDb();
  const res = await db.query(
    `SELECT * FROM songs WHERE is_trending = true order by upvote_count desc, play_count desc limit $1 offset $2`,
    [limit, offset]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  return getSongsFromSqlResult(res);
}

export async function getUserSongs(
  user_uuid: string,
  page: number,
  limit: number
): Promise<Song[] | undefined> {
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const db = getDb();
  const res = await db.query(
    `SELECT * FROM songs order WHERE user_uuid = $1 order by created_at desc limit $2 offset $3`,
    [user_uuid as any, limit, offset]
  );

  if (res.rowCount === 0) {
    return undefined;
  }

  return getSongsFromSqlResult(res);
}

export function getSongsFromSqlResult(
  res: QueryResult<QueryResultRow>
): Song[] {
  if (!res.rowCount || res.rowCount === 0) {
    return [];
  }

  const songs: Song[] = [];
  const { rows } = res;
  rows.forEach((row) => {
    const song = formatSong(row);
    if (song) {
      songs.push(song);
    }
  });

  return songs;
}

export function formatSong(row: QueryResultRow): Song | undefined {
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
  };

  return song;
}
