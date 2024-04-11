import { findByUuid, insertRow } from "@/models/song";
import { respData, respErr } from "@/utils/resp";

import { Song } from "@/types/song";
import { formatSong } from "@/services/song";
import { getSongInfo } from "@/services/suno";
import { getUserUuid } from "@/services/user";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { uuids } = await req.json();
    if (!uuids || uuids.length === 0) {
      return respErr("invalid params");
    }

    const data = await getSongInfo(uuids);
    if (!data || data.length === 0) {
      return respErr("fetch songs failed");
    }

    const user_uuid = await getUserUuid();

    let songs: Song[] = [];
    data.forEach(async (item: any) => {
      const song = formatSong(item, false);
      if (song) {
        song.user_uuid = user_uuid;
        songs.push(song);
        if (song.status === "complete") {
          insertRow(song);
        }
      }
    });

    return respData(songs);
  } catch (e) {
    console.log("fetch songs failed:", e);
    return respErr("fetch songs failed");
  }
}
