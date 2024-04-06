import { Song } from "@/types/song";
import { useTranslations } from "next-intl";

export default function ({ song }: { song: Song }) {
  const t = useTranslations("song");

  return (
    <div className="mt-4">
      <h2 className="text-lg font-medium">{t("lyrics")}</h2>
      <div className="mt-4 min-h-xs max-w-md whitespace-pre truncate leading-loose">
        {song.lyrics}
      </div>
    </div>
  );
}
