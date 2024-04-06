"use client";

import { useAppContext } from "@/contexts/app";
import { useEffect } from "react";

export default function () {
  const { user } = useAppContext();

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  return (
    <div>
      favorites
      {user && user.nickname}
    </div>
  );
}
