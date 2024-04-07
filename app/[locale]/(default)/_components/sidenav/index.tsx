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
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("nav");

  const { setIsSiderOpen } = useAppContext();
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
      active: pathname.endsWith("playlists"),
    },
  ];

  const libraryNavs: Nav[] = [
    {
      title: t("favorites"),
      url: "/favorites",
      icon: <MdOutlineFavorite className="text-lg" />,
      active: pathname.endsWith("favorites"),
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
          <div className="space-y-1">
            {musicNavs.map((nav: Nav, idx: number) => {
              return (
                <Button
                  key={idx}
                  variant="ghost"
                  className={`md:w-full hover:bg-base-100 justify-start gap-x-1 ${
                    nav.active ? "text-primary hover:text-primary" : ""
                  }`}
                  onClick={() => {
                    if (nav.url) {
                      router.push(nav.url);
                      setIsSiderOpen(false);
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
                  className={`md:w-full hover:bg-base-100 justify-start gap-x-1 ${
                    nav.active ? "text-primary hover:text-primary" : ""
                  }`}
                  onClick={() => {
                    if (nav.url) {
                      router.push(nav.url);
                      setIsSiderOpen(false);
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
