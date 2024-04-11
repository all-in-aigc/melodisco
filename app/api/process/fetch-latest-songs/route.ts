import { formatSong, updateSongs } from "@/services/song";
import { respData, respErr } from "@/utils/resp";

import { Song } from "@/types/song";
import { getLatestSongs } from "@/services/suno";
import { getLatestSongs as getUdioLatestSongs } from "@/services/udio";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { page, page_size, provider } = await req.json();

    let songs: Song[] = [];

    if (provider === "udio") {
      const data = await getUdioLatestSongs(page, page_size);

      if (data && data["data"]) {
        data["data"].forEach((item: any) => {
          const song = formatSong(item, false, provider);
          songs.push(song);
        });
      }
    } else {
      const data = await getLatestSongs(page);
      if (data && data["playlist_clips"]) {
        data["playlist_clips"].forEach((item: any) => {
          const song = formatSong(item["clip"], false, "suno");
          songs.push(song);
        });
      }
    }

    if (songs.length === 0) {
      return respErr("no data");
    }

    const result = await updateSongs(songs);

    return respData(result);
  } catch (e) {
    console.log("fetch latest songs failed:", e);
    return respErr("fetch latest songs failed");
  }
}
