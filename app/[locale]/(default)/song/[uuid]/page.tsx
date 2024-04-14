import {
  findByUuid,
  getRandomSongs,
  insertRow,
  updateSong,
} from "@/models/song";

import Crumb from "../../_components/crumb";
import Header from "../../_components/song/header";
import List from "../../_components/song/list";
import Lyrics from "../../_components/song/lyrics";
import { Metadata } from "next";
import { Nav } from "@/types/nav";
import { formatSong } from "@/services/song";
import { getSongInfo } from "@/services/suno";
import { getTranslations } from "next-intl/server";

export const maxDuration = 120;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; uuid: string };
}): Promise<Metadata> {
  const t = await getTranslations("metadata");

  let title = "";
  let description = "";
  let song = await findByUuid(params.uuid);
  if (song) {
    title = t("song_title").replace("%s", song.title || "");
    description = t("song_description").replace("%s", song.title || "");
    if (song.provider === "udio") {
      description = description.replace("Suno", "Udio");
    }
  }

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${process.env.NEXTAUTH_URL}/${
        params.locale !== "en" ? params.locale + "/" : ""
      }song/${params.uuid}`,
    },
  };
}

export default async function ({ params }: { params: { uuid: string } }) {
  const t = await getTranslations("nav");
  let song = await findByUuid(params.uuid);

  if (!song) {
    const data = await getSongInfo([params.uuid]);
    if (data && data.length > 0) {
      song = formatSong(data[0], false);
      if (song) {
        song.provider = "suno";
        await insertRow(song);
      }
    }
  } else if (song.status === "create") {
    const data = await getSongInfo([params.uuid]);
    if (data && data.length > 0) {
      song = formatSong(data[0], false);
      if (song) {
        song.provider = "suno";
        await updateSong(song);
      }
    }
  }

  if (!song) {
    return "404";
  } else if (song.status === "create") {
    return "song creating...";
  } else if (song.status === "forbidden") {
    return "403";
  } else {
    if (song.status !== "complete") {
      return song.status;
    }
  }

  const randomSongs = await getRandomSongs(1, 20);

  const crumbNavs: Nav[] = [
    {
      title: t("home"),
      url: "/",
    },
    {
      title: t("roaming"),
      url: "/roaming",
    },
    {
      title: song?.title || "",
      active: true,
    },
  ];

  return (
    <div className="pb-24">
      <Crumb navs={crumbNavs} />

      {song && (
        <>
          <Header song={song} />
          <div className="flex flex-wrap items-start gap-x-8 mt-8">
            <div className="w-full md:flex-1">
              <Lyrics song={song} />
            </div>
            <div className="md:w-96 md:mx-8 border-t md:border-t-0 mt-8 md:mt-0 md:border-l border-base-200 md:px-8 truncate">
              <div className="mt-4">
                <h2 className="text-lg mb-4 font-medium">{t("recommended")}</h2>

                {randomSongs && <List songs={randomSongs} />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
