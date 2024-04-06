import { getUuids, insertRow } from "@/models/song";
import { respData, respErr } from "@/utils/resp";

import { getSongsFromFile } from "@/services/song";

export async function POST() {
  try {
    const uuids = await getUuids();
    const allSongs = await getSongsFromFile();
    const allSongsCount = allSongs.length;

    console.log(
      `all songs count: ${allSongsCount}, exist songs count: ${uuids.length}`
    );

    let existCount = 0;
    let newCount = 0;
    let failedCount = 0;
    for (let i = 0; i < allSongsCount; i++) {
      const song = allSongs[i];
      if (!song.uuid) {
        continue;
      }

      if (uuids && uuids.includes(song.uuid)) {
        console.log("song exist: ", song.uuid, song.audio_url);
        existCount += 1;
        continue;
      }

      try {
        await insertRow(song);
        newCount += 1;
        console.log(
          "insert new songs: ",
          song.uuid,
          song.audio_url,
          i,
          allSongsCount - i
        );
      } catch (e) {
        failedCount += 1;
        console.log("insert song failed: ", song.uuid, song.audio_url, i, e);
      }
    }

    return respData({
      all_count: allSongsCount,
      exist_count: existCount,
      new_count: newCount,
      failed_count: failedCount,
    });
  } catch (e) {
    console.log("update songs failed: ", e);
    return respErr("update songs failed");
  }
}
