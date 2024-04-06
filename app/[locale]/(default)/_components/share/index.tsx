"use client";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdOutlineShare } from "react-icons/md";
import { toast } from "sonner";

export default function ({ shareUrl }: { shareUrl: string }) {
  return (
    <CopyToClipboard
      text={`${shareUrl}`}
      onCopy={() => toast.success("copied")}
    >
      <button className="mx-2">
        <MdOutlineShare className="text-xl" />
      </button>
    </CopyToClipboard>
  );
}
