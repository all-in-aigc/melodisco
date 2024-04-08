import { formatSong, updateSongs } from "@/services/song";
import { respData, respErr } from "@/utils/resp";

import { Song } from "@/types/song";
import { getTrendingSongs } from "@/services/suno";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { page } = await req.json();

    let songs: Song[] = [];

    const data = await getTrendingSongs(page);
    if (data && data["playlist_clips"]) {
      data["playlist_clips"].forEach((item: any) => {
        const song = formatSong(item["clip"], true);
        songs.push(song);
      });
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
