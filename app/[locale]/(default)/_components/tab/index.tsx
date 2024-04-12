"use client";

import { usePathname } from "next/navigation";

export default function ({ type }: { type: string }) {
  const pathname = usePathname();

  return (
    <div role="tablist" className="tabs tabs-boxed mt-2">
      <a
        href={`/${type}`}
        className={`tab ${
          pathname.endsWith(type) ? "bg-primary text-base-content" : ""
        }`}
      >
        All
      </a>
      <a
        href={`/${type}/suno-ai-songs`}
        className={`tab ${
          pathname.endsWith("suno-ai-songs")
            ? "bg-primary text-base-content"
            : ""
        }`}
      >
        Suno AI Songs
      </a>
      <a
        href={`/${type}/udio-ai-songs`}
        className={`tab ${
          pathname.endsWith("udio-ai-songs")
            ? "bg-primary text-base-content"
            : ""
        }`}
      >
        Udio AI Songs
      </a>
    </div>
  );
}
