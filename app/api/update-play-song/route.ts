import { respErr, respOk } from "@/utils/resp";

import { PlaySong } from "@/types/song";
import { getIsoTimestr } from "@/utils";
import { getUserUuid } from "@/services/user";
import { increasePlayCount } from "@/models/song";
import { insertPlaySong } from "@/models/play_song";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { song_uuid } = await req.json();
    if (!song_uuid) {
      return respErr("invalid params");
    }

    const user_uuid = await getUserUuid();
    if (user_uuid) {
      const playSong: PlaySong = {
        song_uuid: song_uuid,
        user_uuid: user_uuid,
        created_at: getIsoTimestr(),
      };
      insertPlaySong(playSong);
    }

    increasePlayCount(song_uuid);

    return respOk();
  } catch (e) {
    console.log("update play song failed: ", e);
    return respErr("update play song failed");
  }
}
