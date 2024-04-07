import { findByUuid, getRandomSongs, insertRow } from "@/models/song";

import Header from "../../_components/song/header";
import List from "../../_components/song/list";
import Lyrics from "../../_components/song/lyrics";
import { formatSong } from "@/services/song";
import { getSongInfo } from "@/services/suno";
import { getTranslations } from "next-intl/server";

export default async function ({ params }: { params: { uuid: string } }) {
  const t = await getTranslations("nav");
  let song = await findByUuid(params.uuid);
  if (!song) {
    const data = await getSongInfo([params.uuid]);
    if (data && data.length > 0) {
      song = formatSong(data[0], false);
      if (song) {
        await insertRow(song);
      }
    }
  }

  const randomSongs = await getRandomSongs(1, 10);

  return (
    <div className="pb-24">
      {song && (
        <>
          <Header song={song} />
          <div className="flex flex-wrap items-start gap-x-8 mt-8">
            <div className="w-full md:flex-1">
              <Lyrics song={song} />
            </div>
            <div className="md:w-96 md:mx-8 border-t md:border-t-0 mt-8 md:mt-0 md:border-l border-base-200 md:px-8 truncate">
              <div className="mt-4">
                <h2 className="text-lg mb-4 font-medium">{t("roaming")}</h2>

                {randomSongs && <List songs={randomSongs} />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
