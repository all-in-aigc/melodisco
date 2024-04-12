import { findByUuid, insertRow } from "@/models/song";

import { Song } from "@/types/song";
import { formatSong } from "@/services/song";
import { getSongInfo } from "@/services/udio";
import { redirect } from "next/navigation";

export const maxDuration = 120;

export default async function ({ params }: { params: { uuid: string } }) {
  let song: Song | null = null;

  const data = await getSongInfo([params.uuid]);
  if (
    data &&
    data["songs"] &&
    data["songs"].length > 0 &&
    data["songs"][0]["finished"]
  ) {
    song = formatSong(data["songs"][0], false, "udio");

    if (song && song.uuid) {
      let existSong = await findByUuid(song.uuid);
      if (!existSong) {
        await insertRow(song);
      }
    }
  }

  if (!song || song.status !== "complete") {
    return "404";
  }

  redirect(`/song/${song.uuid}`);
}
