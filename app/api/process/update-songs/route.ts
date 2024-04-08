import { getSongsFromFile, updateSongs } from "@/services/song";
import { respData, respErr } from "@/utils/resp";

export const maxDuration = 120;

export async function POST() {
  try {
    const allSongs = await getSongsFromFile();
    if (!allSongs || allSongs.length === 0) {
      return respErr("no data");
    }

    const result = await updateSongs(allSongs);

    return respData(result);
  } catch (e) {
    console.log("update songs failed: ", e);
    return respErr("update songs failed");
  }
}
