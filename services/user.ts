import { findUserByEmail, insertUser } from "@/models/user";

import { User } from "@/types/user";
import { authOptions } from "@/configs/auth";
import { getServerSession } from "next-auth";

export async function saveUser(user: User) {
  try {
    const existUser = await findUserByEmail(user.email);
    if (!existUser) {
      await insertUser(user);
    } else {
      user.id = existUser.id;
      user.uuid = existUser.uuid;
      user.created_at = existUser.created_at;
    }
  } catch (e) {
    console.log("save user failed: ", e);
  }
}

export async function getUserUuid() {
  let user_uuid = "";

  const session = await getServerSession(authOptions);
  if (session && session.user && session.user.uuid) {
    user_uuid = session.user.uuid;
  }

  return user_uuid;
}

export async function getUserEmail() {
  let user_email = "";

  const session = await getServerSession(authOptions);
  console.log("session", session);
  if (session && session.user && session.user.email) {
    user_email = session.user.email;
  }

  return user_email;
}
