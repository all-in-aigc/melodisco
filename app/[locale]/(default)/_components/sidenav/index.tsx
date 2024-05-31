"use client";

import {
  MdLocalFireDepartment,
  MdMusicNote,
  MdOutlineFavorite,
  MdOutlineLibraryMusic,
  MdOutlinePlayCircleOutline,
  MdOutlineRadio,
  MdOutlineRssFeed,
  MdOutlineWorkspacePremium,
} from "react-icons/md";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Nav } from "@/types/nav";
import { PiPlaylistDuotone } from "react-icons/pi";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("nav");
  const params = useParams();
  const locale = params.locale as string;
  const { setIsSiderOpen } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const musicNavs: Nav[] = [
    {
      title: t("discover"),
      url: `/`,
      icon: <MdMusicNote className="text-lg" />,
      active: pathname === "/" || pathname === `/${params.locale}`,
    },
    {
      title: t("trending"),
      url: "/trending",
      icon: <MdLocalFireDepartment className="text-lg" />,
      active: pathname.includes("trending"),
    },
    {
      title: t("newest"),
      url: "/newest",
      icon: <MdOutlineRssFeed className="text-lg" />,
      active: pathname.includes("newest"),
    },
    {
      title: t("roaming"),
      url: "/roaming",
      icon: <MdOutlineRadio className="text-lg" />,
      active: pathname.endsWith("roaming"),
    },
    // {
    //   title: t("playlists"),
    //   url: "/playlists",
    //   icon: <PiPlaylistDuotone className="text-lg" />,
    //   active: pathname.endsWith("playlists"),
    // },
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
    // {
    //   title: t("creations"),
    //   url: "/creations",
    //   icon: <MdOutlineWorkspacePremium className="text-lg" />,
    //   active: pathname.endsWith("creations"),
    // },
  ];

  const toolsNavs: Nav[] = [
    {
      title: t("create"),
      url: `/create`,
      icon: <MdOutlineLibraryMusic className="text-lg" />,
      active: pathname.endsWith("create"),
    },
  ];

  const getNavUrl = (nav: Nav) => {
    if (nav.url) {
      if (locale && locale !== "en" && !nav.url.startsWith(`/${locale}`)) {
        return `/${locale}${nav.url}`;
      }
    }

    return nav.url;
  };

  const Navs = (navs: Nav[]) => {
    return (
      <>
        {navs.map((nav: Nav, idx: number) => {
          return (
            <Link
              href={getNavUrl(nav) || ""}
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setIsSiderOpen(false);
              }}
            >
              <Button
                key={idx}
                variant="ghost"
                className={`md:w-full hover:bg-base-100 justify-start gap-x-1 ${
                  nav.active
                    ? "text-primary hover:text-primary"
                    : "hover:text-base-content"
                }`}
              >
                {nav.icon}
                {nav.title}
              </Button>
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <div className="pb-24">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <p className="mb-2 px-4 text-sm font-semibold tracking-tight">
            {t("music")}
          </p>
          <div className="space-y-1 w-40">{Navs(musicNavs)}</div>
        </div>

        <div className="px-3 py-2">
          <p className="mb-2 px-4 text-sm font-semibold tracking-tight">
            {t("library")}
          </p>
          <div className="space-y-1 w-40">{Navs(libraryNavs)}</div>
        </div>

        {/* <div className="px-3 py-2">
          <p className="mb-2 px-4 text-sm font-semibold tracking-tight">
            {t("tools")}
          </p>
          <div className="space-y-1 w-40">{Navs(toolsNavs)}</div>
        </div> */}
      </div>
    </div>
  );
}
