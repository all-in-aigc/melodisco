import { QueryResultRow } from "pg";
import { User } from "@/types/user";
import { getDb } from "@/models/db";

export async function insertUser(user: User) {
  const db = await getDb();
  const res = await db.query(
    `INSERT INTO users 
      (uuid, email, created_at, nickname, avatar_url, locale, signin_type, signin_ip, signin_provider, signin_openid) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `,
    [
      user.uuid,
      user.email,
      user.created_at || "",
      user.nickname,
      user.avatar_url,
      user.locale || "",
      user.signin_type || "",
      user.signin_ip || "",
      user.signin_provider || "",
      user.signin_openid || "",
    ]
  );

  return res;
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const db = getDb();
  const res = await db.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [
    email,
  ]);
  if (res.rowCount === 0) {
    return undefined;
  }

  const { rows } = res;

  return formatUser(rows[0]);
}

export async function findUserByUuid(uuid: string): Promise<User | undefined> {
  const db = getDb();
  const res = await db.query(
    `SELECT * FROM users WHERE uuid::VARCHAR = $1 LIMIT 1`,
    [uuid]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  const { rows } = res;

  return formatUser(rows[0]);
}

export function formatUser(row: QueryResultRow): User {
  const user: User = {
    uuid: row.uuid,
    email: row.email,
    created_at: row.created_at,
    nickname: row.nickname,
    avatar_url: row.avatar_url,
    locale: row.locale,
    signin_type: row.signin_type,
    signin_ip: row.signin_ip,
  };

  return user;
}
