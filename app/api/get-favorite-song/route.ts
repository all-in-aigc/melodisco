import { respData, respErr } from "@/utils/resp";

import { findFavoriteSong } from "@/models/favorite_song";
import { getUserUuid } from "@/services/user";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { song_uuid } = await req.json();
    if (!song_uuid) {
      return respErr("invalid params");
    }

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const favoriteSong = await findFavoriteSong(song_uuid, user_uuid);

    return respData(favoriteSong);
  } catch (e) {
    console.log("get favorite song failed:", e);
    return respErr("get favorite song failed");
  }
}
