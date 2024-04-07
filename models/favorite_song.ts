import { FavoriteSong } from "@/types/song";
import { QueryResultRow } from "pg";
import { getDb } from "./db";

export async function insertFavoriteSong(song: FavoriteSong) {
  const db = getDb();
  const res = await db.query(
    `INSERT INTO favorite_songs 
      (song_uuid, user_uuid, created_at, updated_at, status) 
      VALUES 
      ($1, $2, $3, $4, $5)
  `,
    [
      song.song_uuid,
      song.user_uuid,
      song.created_at,
      song.updated_at,
      song.status,
    ]
  );

  return res;
}

export async function updateFavoriteSong(song: FavoriteSong) {
  const db = getDb();
  const res = await db.query(
    `UPDATE favorite_songs SET status = $1, updated_at = $2 WHERE song_uuid = $3 AND user_uuid = $4
  `,
    [song.status, song.updated_at, song.song_uuid, song.user_uuid]
  );

  return res;
}

export async function findFavoriteSong(
  song_uuid: string,
  user_uuid: string
): Promise<FavoriteSong | undefined> {
  const db = getDb();
  const res = await db.query(
    `SELECT * FROM favorite_songs WHERE song_uuid = $1 AND user_uuid = $2 LIMIT 1`,
    [song_uuid, user_uuid]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  const { rows } = res;

  return formatFavoriteSong(rows[0]);
}

export function formatFavoriteSong(row: QueryResultRow): FavoriteSong {
  const favoriteSong: FavoriteSong = {
    song_uuid: row.song_uuid,
    user_uuid: row.user_uuid,
    created_at: row.created_at,
    updated_at: row.updated_at,
    status: row.status,
  };

  return favoriteSong;
}
