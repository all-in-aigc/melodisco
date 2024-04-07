"use client";

import Image from "next/image";
import { Song } from "@/types/song";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ({ songs }: { songs: Song[] }) {
  const t = useTranslations("nav");

  const router = useRouter();
  return (
    <div>
      {songs.map((song: Song) => {
        if (!song.title || !song.image_url) {
          return;
        }
        return (
          <div
            key={song.uuid}
            onClick={() => router.push(`/song/${song.uuid}`)}
            className="flex items-start gap-x-2 my-2 py-2 border-b border-base-200 overflow-hidden cursor-pointer"
          >
            <Image
              src={song.image_url}
              width={60}
              height={60}
              alt={song.title}
              className="rounded-md"
            />
            <div>
              <h3 className="truncate w-60 font-medium">{song.title}</h3>
              <p className="truncate w-60">{song.tags}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
