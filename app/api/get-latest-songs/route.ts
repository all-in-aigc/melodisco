import { respData, respErr } from "@/utils/resp";

import { getLatestSongs } from "@/models/song";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { page, limit } = await req.json();
    const songs = await getLatestSongs(page, limit);

    return respData(songs);
  } catch (e) {
    console.log("get latest songs failed:", e);
    return respErr("get latest songs failed");
  }
}
