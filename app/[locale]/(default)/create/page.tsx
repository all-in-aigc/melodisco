import Crumb from "../_components/crumb";
import Generator from "../_components/generator";
import { Metadata } from "next";
import { Nav } from "@/types/nav";
import { getTranslations } from "next-intl/server";

export const maxDuration = 120;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations("");

  return {
    title: `${t("nav.create")} | ${t("metadata.title")}`,
    description: `${t("nav.create")} | ${t("metadata.description")}`,
    alternates: {
      canonical: `${process.env.NEXTAUTH_URL}/${
        params.locale !== "en" ? params.locale + "/" : ""
      }create`,
    },
  };
}

export default async function () {
  const t = await getTranslations("nav");

  const crumbNavs: Nav[] = [
    {
      title: t("home"),
      url: "/",
    },
    {
      title: t("create"),
      active: true,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("create")}
          </h1>
          <p className="text-sm text-muted-foreground"></p>
        </div>
      </div>

      <Generator />
    </div>
  );
}
