import { User } from "@/types/user";
import { getSupabaseClient } from "./db";

export async function insertUser(user: User) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        uuid: user.uuid,
        email: user.email,
        created_at: user.created_at || new Date().toISOString(),
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        locale: user.locale || "",
        signin_type: user.signin_type || "",
        signin_ip: user.signin_ip || "",
        signin_provider: user.signin_provider || "",
        signin_openid: user.signin_openid || "",
      },
    ])
    .select();

  if (error) throw error;
  return data;
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return undefined;
  return formatUser(data);
}

export async function findUserByUuid(uuid: string): Promise<User | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) return undefined;
  return formatUser(data);
}

export function formatUser(row: any): User {
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
