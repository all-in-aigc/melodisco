"use client";

import Describe from "./describe";
import Sign from "../sign";
import { useAppContext } from "@/contexts/app";

export default function () {
  const { user } = useAppContext();

  return (
    <div className="max-w-full md:max-w-6xl flex-1">
      {user ? (
        <Describe />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Sign />
        </div>
      )}
    </div>
  );
}
