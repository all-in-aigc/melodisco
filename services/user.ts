import { findUserByEmail, insertUser } from "@/models/user";

import { User } from "@/types/user";

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
