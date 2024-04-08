import {
  MdLocalFireDepartment,
  MdOutlineRadio,
  MdOutlineRssFeed,
} from "react-icons/md";
import {
  getLatestSongs,
  getRandomSongs,
  getTrendingSongs,
} from "@/models/song";

import { Metadata } from "next";
import Scroll from "./_components/playlist/scroll";
import { getTranslations } from "next-intl/server";

export const maxDuration = 120;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    title: t("discover_title"),
    description: t(`discover_description`),
    alternates: {
      canonical: `${process.env.NEXTAUTH_URL}/${
        params.locale !== "en" ? params.locale : ""
      }`,
    },
  };
}

export default async function () {
  const t = await getTranslations("nav");
  const trendingSongs = await getTrendingSongs(1, 50);
  const trendingLoading = false;
  const latestSongs = await getLatestSongs(1, 50);
  const latestLoading = false;
  const randomSongs = await getRandomSongs(1, 50);
  const randomLoading = false;

  return (
    <div className="w-full md:max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight">{t("discover")}</h1>

      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-x-2">
          <MdLocalFireDepartment />
          {t("trending")}
        </h2>
        <Scroll loading={trendingLoading} songs={trendingSongs || []} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-x-2">
          <MdOutlineRssFeed />
          {t("newest")}
        </h2>
        <Scroll loading={latestLoading} songs={latestSongs || []} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-x-2">
          <MdOutlineRadio />
          {t("roaming")}
        </h2>
        <Scroll loading={randomLoading} songs={randomSongs || []} />
      </div>
    </div>
  );
}
