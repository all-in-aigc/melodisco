import { respData, respErr } from "@/utils/resp";

import { getRandomSongs } from "@/models/song";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { page, limit } = await req.json();
    const songs = await getRandomSongs(page, limit);

    return respData(songs);
  } catch (e) {
    console.log("get random songs failed:", e);
    return respErr("get random songs failed");
  }
}
