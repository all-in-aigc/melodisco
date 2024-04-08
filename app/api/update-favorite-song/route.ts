import {
  findFavoriteSong,
  insertFavoriteSong,
  updateFavoriteSong,
} from "@/models/favorite_song";
import { respData, respErr } from "@/utils/resp";

import { FavoriteSong } from "@/types/song";
import { getIsoTimestr } from "@/utils";
import { getUserUuid } from "@/services/user";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { song_uuid, status } = await req.json();
    if (!song_uuid || !status || !["on", "off"].includes(status)) {
      return respErr("invalid params");
    }

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const current_time = getIsoTimestr();

    let favoriteSong = await findFavoriteSong(song_uuid, user_uuid);
    if (!favoriteSong) {
      favoriteSong = {
        song_uuid: song_uuid,
        user_uuid: user_uuid,
        created_at: current_time,
        updated_at: current_time,
        status: status,
      };
      insertFavoriteSong(favoriteSong);

      return respData(favoriteSong);
    }

    favoriteSong.status = status;
    favoriteSong.updated_at = current_time;
    updateFavoriteSong(favoriteSong);

    return respData(favoriteSong);
  } catch (e) {
    console.log("update favorite song failed:", e);
    return respErr("update favorite song failed");
  }
}
