import { findUserByEmail, findUserByUuid, insertUser } from "@/models/user";
import { getUserEmail, getUserUuid } from "@/services/user";
import { respData, respErr } from "@/utils/resp";

import { User } from "@/types/user";
import { genUuid } from "@/utils";
import { getUserCredits } from "@/services/order";

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const user = await findUserByUuid(user_uuid);
    if (!user) {
      return respErr("user not exist");
    }

    const user_credits = await getUserCredits(user_uuid);
    user.credits = user_credits;

    return respData(user);
  } catch (e) {
    console.log("get user info failed");
    return respErr("get user info failed");
  }
}
