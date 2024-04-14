import { genUniSeq, getIsoTimestr } from "@/utils";
import { insertSongTask, updateSongTask } from "@/models/task";
import { respData, respErr } from "@/utils/resp";

import { Song } from "@/types/song";
import { SongTask } from "@/types/task";
import { genSong } from "@/services/suno";
import { getUserUuid } from "@/services/user";
import { insertRow } from "@/models/song";

export async function POST(req: Request) {
  try {
    const { description, title, lyrics, tags, is_no_lyrics, mode } =
      await req.json();

    if (mode === "custom") {
      if (!title || !tags) {
        return respErr("invalid params");
      }
      if (!is_no_lyrics && !lyrics) {
        return respErr("invalid params");
      }
    } else {
      if (!description) {
        return respErr("invalid params");
      }
    }

    const task_uuid = genUniSeq();
    let song_uuids: string[] = [];

    let res: any = null;

    if (mode === "custom") {
      if (is_no_lyrics) {
        res = await genSong(task_uuid, "", title, "", is_no_lyrics, tags);
      } else {
        res = await genSong(task_uuid, "", title, lyrics, is_no_lyrics, tags);
      }
    } else {
      res = await genSong(
        task_uuid,
        `${description}, ${tags}`,
        "",
        "",
        is_no_lyrics,
        ""
      );
    }

    if (res && res["clips"]) {
      res["clips"].forEach((v: any) => {
        song_uuids.push(v["id"]);
      });
    }

    if (song_uuids.length === 0) {
      return respErr("gen song failed");
    }

    const user_uuid = await getUserUuid();
    const created_at = getIsoTimestr();
    const llm_model = "chirp-v3";
    const provider = "suno";
    const status = "create";

    const songTask: SongTask = {
      uuid: task_uuid,
      user_uuid: user_uuid,
      created_at: created_at,
      updated_at: created_at,
      status: status,
      description: description,
      title: title,
      lyrics: lyrics,
      tags: tags,
      is_no_lyrics: is_no_lyrics,
      song_provider: provider,
      song_model: llm_model,
      song_uuids: JSON.stringify(song_uuids),
    };

    song_uuids.forEach((uuid: string) => {
      const song: Song = {
        uuid: uuid,
        llm_model: llm_model,
        tags: tags,
        lyrics: lyrics,
        description: description,
        user_uuid: user_uuid,
        title: title,
        created_at: created_at,
        status: status,
        is_public: false,
        provider: provider,
      };
      insertRow(song);
    });

    await insertSongTask(songTask);

    return respData(songTask);
  } catch (e) {
    console.log("gen song failed: ", e);
    return respErr("gen song failed");
  }
}
