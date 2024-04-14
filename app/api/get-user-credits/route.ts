import { respData, respErr } from "@/utils/resp";

import { getUserCredits } from "@/services/order";
import { getUserUuid } from "@/services/user";

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const user_credits = await getUserCredits(user_uuid);

    return respData(user_credits);
  } catch (e) {
    console.log("get user credits failed:", e);
    return respErr("get user credits failed");
  }
}
