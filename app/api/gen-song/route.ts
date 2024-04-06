import {
  genSong,
  getBillingInfo,
  getJwtToken,
  getLatestSongs,
  getSongInfo,
  getTrendingSongs,
} from "@/services/suno";
import { getSunoLatestSongs, getSunoTrendingSongs } from "@/services/song";
import { respData, respErr } from "@/utils/resp";

export async function POST(req: Request) {
  try {
    const songIds = ["ea5aaa32-a423-4894-a699-057ac9e361cb"];
    const description = "谁在用琵琶弹奏一曲东风破";

    const data = await getSunoLatestSongs(1);

    return respData(data);
  } catch (e) {
    console.log("gen song failed: ", e);
    return respErr("gen song failed");
  }
}
