"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ({ type }: { type: string }) {
  const pathname = usePathname();

  return (
    <div role="tablist" className="tabs tabs-sm md:tabs-md tabs-boxed mt-2">
      <Link
        href={`/${type}`}
        className={`tab ${
          pathname.endsWith(type) ? "bg-primary text-base-content" : ""
        }`}
      >
        All
      </Link>
      <Link
        href={`/${type}/suno-ai-songs`}
        className={`tab ${
          pathname.endsWith("suno-ai-songs")
            ? "bg-primary text-base-content"
            : ""
        }`}
      >
        Suno AI Songs
      </Link>
      <Link
        href={`/${type}/udio-ai-songs`}
        className={`tab ${
          pathname.endsWith("udio-ai-songs")
            ? "bg-primary text-base-content"
            : ""
        }`}
      >
        Udio AI Songs
      </Link>
    </div>
  );
}
