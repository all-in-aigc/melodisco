import { respData, respErr } from "@/utils/resp";

import { getUserCreatedSongs } from "@/models/task";
import { getUserUuid } from "@/services/user";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { page, limit } = await req.json();

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const favoriteSongs = await getUserCreatedSongs(user_uuid, page, limit);

    return respData(favoriteSongs);
  } catch (e) {
    console.log("get user create songs failed:", e);
    return respErr("get user create songs failed");
  }
}
