import { PlaySong, Song } from "@/types/song";

import { getDb } from "./db";
import { getSongsFromSqlResult } from "./song";

export async function insertPlaySong(song: PlaySong) {
  const db = getDb();
  const res = await db.query(
    `INSERT INTO play_songs 
      (song_uuid, user_uuid, created_at) 
      VALUES 
      ($1, $2, $3)
  `,
    [song.song_uuid, song.user_uuid, song.created_at]
  );

  return res;
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

  const db = getDb();
  const res = await db.query(
    `SELECT s.*, p.song_uuid, p.created_at
    FROM (
      SELECT song_uuid, MAX(created_at) as MaxCreatedAt
      FROM play_songs WHERE user_uuid = $1 
      GROUP BY song_uuid
    ) AS latest
    JOIN play_songs p ON latest.song_uuid = p.song_uuid AND latest.MaxCreatedAt = p.created_at
    JOIN songs s ON p.song_uuid = s.uuid
    ORDER BY p.created_at DESC LIMIT $2 OFFSET $3;`,
    [user_uuid as any, limit, offset]
  );

  if (res.rowCount === 0) {
    return undefined;
  }

  return getSongsFromSqlResult(res);
}
