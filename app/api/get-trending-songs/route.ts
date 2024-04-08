import { respData, respErr } from "@/utils/resp";

import { getTrendingSongs } from "@/models/song";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { page, limit } = await req.json();
    const songs = await getTrendingSongs(page, limit);

    return respData(songs);
  } catch (e) {
    console.log("get trending songs failed:", e);
    return respErr("get trending songs failed");
  }
}
