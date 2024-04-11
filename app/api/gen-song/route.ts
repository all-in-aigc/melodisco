import {
  genLyrics,
  genSong,
  getBillingInfo,
  getJwtToken,
  getLatestSongs,
  getSongInfo,
  getTrendingSongs,
} from "@/services/suno";
import { getSunoLatestSongs, getSunoTrendingSongs } from "@/services/song";
import { respData, respErr } from "@/utils/resp";

import { SongTask } from "@/types/task";
import { getIsoTimestr } from "@/utils";
import { updateSongTask } from "@/models/task";

export async function POST(req: Request) {
  try {
    const { task_uuid, description, title, lyrics, tags, is_no_lyrics } =
      await req.json();
    if (!task_uuid) {
      return respErr("invalid params");
    }
    if (!description) {
      if (!title || !lyrics || !tags) {
        return respErr("invalid params");
      }
    }

    let song_uuids: string[] = [];

    const data = await genSong(description, title, lyrics, is_no_lyrics, tags);
    if (data && data["clips"]) {
      data["clips"].forEach((v: any) => {
        song_uuids.push(v["id"]);
      });
    }

    if (song_uuids.length === 0) {
      return respErr("gen song failed");
    }

    const songTask: SongTask = {
      uuid: task_uuid,
      user_uuid: "",
      created_at: "",
      updated_at: getIsoTimestr(),
      status: "gen_song",
      description: description,
      title: title,
      lyrics: lyrics,
      tags: tags,
      is_no_lyrics: is_no_lyrics,
      song_provider: "suno",
      song_model: "chirp-v3-0",
      song_uuids: JSON.stringify(song_uuids),
    };

    await updateSongTask(songTask);

    return respData(songTask);
  } catch (e) {
    console.log("gen song failed: ", e);
    return respErr("gen song failed");
  }
}
