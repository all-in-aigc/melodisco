import { QueryResult, QueryResultRow } from "pg";

import { Song } from "@/types/song";
import { getDb } from "@/models/db";

export async function insertRow(song: Song) {
  const db = getDb();
  const res = await db.query(
    `INSERT INTO songs 
  (uuid, video_url, audio_url, image_url, image_large_url, llm_model, tags, lyrics, description, duration, type, user_uuid, title, play_count, upvote_count, created_at, status, is_public, is_trending, provider, artist, prompt) 
  VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
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
      song.provider,
      song.artist,
      song.prompt,
    ]
  );

  return res;
}

export async function updateSong(song: Song) {
  const db = getDb();
  const res = await db.query(
    `UPDATE songs SET 
    video_url = $1,
    audio_url = $2,
    image_url = $3,
    image_large_url = $4,
    llm_model = $5,
    tags = $6,
    lyrics = $7,
    description = $8,
    duration = $9,
    type = $10,
    user_uuid = $11,
    title = $12,
    play_count = $13,
    upvote_count = $14,
    created_at = $15,
    status = $16,
    is_public = $17,
    is_trending = $18,
    provider = $19,
    artist = $20,
    prompt = $21 WHERE uuid = $22
`,
    [
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
      song.provider,
      song.artist,
      song.prompt,
      song.uuid,
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
    `SELECT * FROM songs WHERE status = 'complete' AND audio_url != '' order by created_at desc limit $1 offset $2`,
    [limit, offset]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  return getSongsFromSqlResult(res);
}

export async function getProviderLatestSongs(
  provider: string,
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
    `SELECT * FROM songs WHERE provider = $1 AND status = 'complete' AND audio_url != '' order by created_at desc limit $2 offset $3`,
    [provider as any, limit, offset]
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
    `SELECT * FROM songs WHERE status = 'complete' AND audio_url != '' order by random() limit $1 offset $2`,
    [limit, offset]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  return getSongsFromSqlResult(res);
}

export async function getProviderRandomSongs(
  provider: string,
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
    `SELECT * FROM songs WHERE provider = $1 AND status = 'complete' AND audio_url != '' order by random() limit $2 offset $3`,
    [provider as any, limit, offset]
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
    `SELECT * FROM songs WHERE status = 'complete' AND audio_url != '' order by play_count desc, upvote_count desc limit $1 offset $2`,
    [limit, offset]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  return getSongsFromSqlResult(res);
}

export async function getProviderTrendingSongs(
  provider: string,
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
    `SELECT * FROM songs WHERE provider = $1 AND status = 'complete' AND audio_url != '' order by play_count desc, upvote_count desc limit $2 offset $3`,
    [provider as any, limit, offset]
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
    `SELECT * FROM songs order WHERE user_uuid = $1 AND status = 'complete' order by created_at desc limit $2 offset $3`,
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
    if (song && song.status !== "forbidden") {
      songs.push(song);
    }
  });

  return songs;
}

export async function increasePlayCount(song_uuid: string) {
  const db = getDb();
  const res = await db.query(
    `UPDATE songs SET play_count = play_count + 1 WHERE uuid = $1`,
    [song_uuid]
  );

  return res;
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
