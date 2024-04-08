"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("user");

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <p className="mb-8">{t("sign_tip")}</p>
      <Button className="w-40" onClick={() => signIn("google")}>
        {t("sign_in")}
      </Button>
    </div>
  );
}
