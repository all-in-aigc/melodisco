import { findByUuid, insertRow } from "@/models/song";
import { respData, respErr } from "@/utils/resp";

import { formatSong } from "@/services/song";
import { getSongInfo } from "@/services/suno";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { uuid } = await req.json();
    if (!uuid) {
      return respErr("invalid params");
    }

    let song = await findByUuid(uuid);
    if (song) {
      return respData(song);
    }

    const data = await getSongInfo([uuid]);
    if (!data || data.length === 0) {
      return respErr("fetch song failed");
    }

    song = formatSong(data[0], false);

    await insertRow(song);

    return respData(song);
  } catch (e) {
    console.log("fetch song failed:", e);
    return respErr("fetch song failed");
  }
}
