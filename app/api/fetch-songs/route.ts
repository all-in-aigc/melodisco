import { findByUuid, insertRow, updateSong } from "@/models/song";
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

    const suno_uuids: string[] = [];
    const sunoapi_uuids: string[] = [];

    for (const i in uuids) {
      const uuid = uuids[i];
      if (uuid.startsWith("SUNOAPI_")) {
        sunoapi_uuids.push(uuid);
      } else {
        suno_uuids.push(uuid);
      }
    }

    let songs: Song[] = [];

    if (sunoapi_uuids.length > 0) {
      for (const i in sunoapi_uuids) {
        const uuid = sunoapi_uuids[i];
        const song: Song = {
          uuid: uuid,
          status: "create",
        };
        songs.push(song);
      }
    }

    console.log("suno uuids", suno_uuids);
    console.log("api uuids", sunoapi_uuids);

    if (suno_uuids.length === 0) {
      return respData(songs);
    }

    const data = await getSongInfo(uuids);
    if (!data || data.length === 0) {
      return respErr("fetch songs failed");
    }

    console.log("data", data);

    for (const item of data) {
      const song = formatSong(item, false);

      if (song && song.uuid) {
        song.provider = "suno";
        const existSong = await findByUuid(song.uuid);
        if (existSong) {
          updateSong(song);
        } else {
          insertRow(song);
        }

        songs.push(song);
      }
    }

    return respData(songs);
  } catch (e) {
    console.log("fetch songs failed:", e);
    return respErr("fetch songs failed");
  }
}
