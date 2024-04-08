import Crumb from "../_components/crumb";
import { Metadata } from "next";
import { Nav } from "@/types/nav";
import Playlist from "../_components/playlist";
import { getTranslations } from "next-intl/server";
import { getTrendingSongs } from "@/models/song";

export const maxDuration = 120;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    title: t("trending_title"),
    description: t("trending_description"),
    alternates: {
      canonical: `${process.env.NEXTAUTH_URL}/${
        params.locale !== "en" ? params.locale + "/" : ""
      }trending`,
    },
  };
}

export default async function () {
  const t = await getTranslations("nav");
  const songs = await getTrendingSongs(1, 50);
  const loading = false;

  const crumbNavs: Nav[] = [
    {
      title: t("home"),
      url: "/",
    },
    {
      title: t("trending"),
      active: true,
    },
  ];

  return (
    <div>
      <Crumb navs={crumbNavs} />

      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("trending")}
          </h1>
          <p className="text-sm text-muted-foreground"></p>
        </div>
      </div>

      <Playlist loading={loading} songs={songs || []} />
    </div>
  );
}
