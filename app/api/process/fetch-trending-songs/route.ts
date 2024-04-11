import { formatSong, updateSongs } from "@/services/song";
import { respData, respErr } from "@/utils/resp";

import { Song } from "@/types/song";
import { getTrendingSongs } from "@/services/suno";
import { getTrendingSongs as getUdioTrendingSongs } from "@/services/udio";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { page, page_size, provider } = await req.json();

    let songs: Song[] = [];

    if (provider === "udio") {
      const data = await getUdioTrendingSongs(page, page_size);
      console.log("data", data);
      if (data && data["data"]) {
        data["data"].forEach((item: any) => {
          const song = formatSong(item, true, provider);
          songs.push(song);
        });
      }
    } else {
      const data = await getTrendingSongs(page);
      if (data && data["playlist_clips"]) {
        data["playlist_clips"].forEach((item: any) => {
          const song = formatSong(item["clip"], true, "suno");
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
    console.log("fetch trending songs failed:", e);
    return respErr("fetch trending songs failed");
  }
}
