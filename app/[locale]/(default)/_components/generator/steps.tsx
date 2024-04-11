"use client";

import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("create.steps");
  const { songTaskStep: step } = useAppContext();

  return (
    <ul className="steps">
      <li className={`step px-8 ${step >= 1 ? "step-primary" : ""}`}>
        {t("describe")}
      </li>
      <li className={`step ${step >= 2 ? "step-primary" : ""}`}>{t("info")}</li>
      <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
        {t("result")}
      </li>
    </ul>
  );
}
