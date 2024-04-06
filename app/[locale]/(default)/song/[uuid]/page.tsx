import { findByUuid, getRandomSongs } from "@/models/song";

import Header from "../../_components/song/header";
import List from "../../_components/song/list";
import Lyrics from "../../_components/song/lyrics";

export default async function ({ params }: { params: { uuid: string } }) {
  const song = await findByUuid(params.uuid);
  const randomSongs = await getRandomSongs(1, 10);

  return (
    <div className="pb-24 w-full">
      {song && (
        <>
          <Header song={song} />
          <div className="flex items-start gap-x-8 mt-8">
            <div className="flex-1">
              <Lyrics song={song} />
            </div>
            <div className="md:w-96 mx-8 border-l border-base-200 px-8">
              <div className="mt-4">
                {randomSongs && <List songs={randomSongs} />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
