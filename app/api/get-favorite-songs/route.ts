import { respData, respErr } from "@/utils/resp";

import { getUserFavoriteSongs } from "@/models/favorite_song";
import { getUserUuid } from "@/services/user";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { page, limit } = await req.json();

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const favoriteSongs = await getUserFavoriteSongs(user_uuid, page, limit);

    return respData(favoriteSongs);
  } catch (e) {
    console.log("get favorite songs failed:", e);
    return respErr("get favorite songs failed");
  }
}
