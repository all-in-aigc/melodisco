import { genLyrics, getLyrics } from "@/services/suno";
import { genUniSeq, genUuid, getIsoTimestr } from "@/utils";
import { respData, respErr } from "@/utils/resp";

import { SongTask } from "@/types/task";
import { getTimestamp } from "@/utils/time";
import { getUserUuid } from "@/services/user";
import { insertSongTask } from "@/models/task";

export async function POST(req: Request) {
  try {
    const { description } = await req.json();
    if (!description) {
      return respErr("invalid params");
    }

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const res: any = await genLyrics(description);
    if (!res || !res["id"]) {
      console.log("gen lyrics failed:", res);
      return respErr("gen lyrics failed");
    }

    const taskid = res["id"];
    if (!taskid) {
      return respErr("gen lyrics failed");
    }

    const startTime = getTimestamp();
    let loopTime = startTime;

    let song_title = "";
    let song_lyrics = "";

    while (true) {
      const currentTime = getTimestamp();

      if (currentTime - startTime > 30) {
        // timeout
        return respErr("gen lyrics failed: timeout");
      }

      if (currentTime - loopTime === 3) {
        console.log("query lyrics:", taskid, currentTime);
        const data = await getLyrics(taskid);
        console.log("gen lyrics result:", data);

        // gen lyrics ok
        if (data && data["status"] === "complete") {
          song_title = data["title"];
          song_lyrics = data["text"];
          break;
        }

        loopTime = currentTime;
      }
    }

    if (!song_title || !song_lyrics) {
      return respErr("gen song lyrics failed");
    }

    const current_time = getIsoTimestr();

    // todo gen tags
    const tags = "aggressive disco";

    const song_task: SongTask = {
      uuid: genUniSeq(),
      user_uuid: user_uuid,
      created_at: current_time,
      updated_at: current_time,
      status: "gen_lyrics",
      description: description,
      title: song_title,
      lyrics: song_lyrics,
      tags: tags,
      is_no_lyrics: false,
      lyrics_provider: "suno",
      lyrics_uuid: taskid,
    };

    await insertSongTask(song_task);

    return respData(song_task);
  } catch (e) {
    console.log("gen song lyrics failed:", e);
    return respErr("gen song lyrics failed");
  }
}
