"use client";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdOutlineShare } from "react-icons/md";
import { Song } from "@/types/song";
import { toast } from "sonner";

export default function ({ song }: { song: Song }) {
  const shareUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/song/${song.uuid}`;

  return (
    <CopyToClipboard
      text={`${shareUrl}`}
      onCopy={() => toast.success("copied")}
    >
      <MdOutlineShare className="text-xl" />
    </CopyToClipboard>
  );
}
