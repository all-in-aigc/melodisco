import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("steps");

  return (
    <ul className="steps steps-vertical lg:steps-horizontal gap-x-4">
      <li className="step step-primary w-40">{t("describe")}</li>
      <li className="step">{t("lyric")}</li>
      <li className="step">{t("create")}</li>
    </ul>
  );
}
