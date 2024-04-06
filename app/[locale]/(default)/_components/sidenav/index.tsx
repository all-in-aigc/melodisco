"use client";

import {
  MdLocalFireDepartment,
  MdMusicNote,
  MdOutlineFavorite,
  MdOutlinePlayCircleOutline,
  MdOutlineRadio,
  MdOutlineRssFeed,
} from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Nav } from "@/types/nav";
import { PiPlaylistDuotone } from "react-icons/pi";
import { Playlist } from "../../_data/playlists";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const musicNavs: Nav[] = [
    {
      title: t("discover"),
      url: "/discover",
      icon: <MdMusicNote className="text-lg" />,
      active: pathname.endsWith("discover"),
    },
    {
      title: t("trending"),
      url: "/trending",
      icon: <MdLocalFireDepartment className="text-lg" />,
      active: pathname.endsWith("trending"),
    },
    {
      title: t("newest"),
      url: "/newest",
      icon: <MdOutlineRssFeed className="text-lg" />,
      active: pathname.endsWith("newest"),
    },
    {
      title: t("roaming"),
      url: "/roaming",
      icon: <MdOutlineRadio className="text-lg" />,
      active: pathname.endsWith("roaming"),
    },
    {
      title: t("playlists"),
      url: "/playlists",
      icon: <PiPlaylistDuotone className="text-lg" />,
      active: pathname.endsWith("playlist"),
    },
  ];

  const libraryNavs: Nav[] = [
    {
      title: t("favorites"),
      url: "/favorites",
      icon: <MdOutlineFavorite className="text-lg" />,
      active: pathname.endsWith("favorite"),
    },
    {
      title: t("recently"),
      url: "/recently",
      icon: <MdOutlinePlayCircleOutline className="text-lg" />,
      active: pathname.endsWith("recently"),
    },
  ];

  return (
    <div className="pb-24">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">
            {t("music")}
          </h2>
          <div className="space-y-1 w-[250px]">
            {musicNavs.map((nav: Nav, idx: number) => {
              return (
                <Button
                  key={idx}
                  variant="ghost"
                  className={`w-full justify-start gap-x-1 ${
                    nav.active ? "bg-base-300 text-base-content" : ""
                  }`}
                  onClick={() => {
                    if (nav.url) {
                      router.push(nav.url);
                    }
                  }}
                >
                  {nav.icon}
                  {nav.title}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">
            {t("library")}
          </h2>
          <div className="space-y-1">
            {libraryNavs.map((nav: Nav, idx: number) => {
              return (
                <Button
                  key={idx}
                  variant="ghost"
                  className="w-full justify-start gap-x-1"
                  onClick={() => {
                    if (nav.url) {
                      router.push(nav.url);
                    }
                  }}
                >
                  {nav.icon}
                  {nav.title}
                </Button>
              );
            })}
          </div>
        </div>

        {/* <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2"></div>
          </ScrollArea>
        </div> */}
      </div>
    </div>
  );
}
