import Crumb from "../_components/crumb";
import Describe from "../_components/create/describe";
import Info from "../_components/create/info";
import { Nav } from "@/types/nav";
import Preview from "../_components/create/preview";
import { getTranslations } from "next-intl/server";

export default async function () {
  const t = await getTranslations("nav");

  const crumbNavs: Nav[] = [
    {
      title: t("home"),
      url: "/",
    },
    {
      title: t("create"),
      active: true,
    },
  ];

  return (
    <div>
      <Crumb navs={crumbNavs} />

      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("create")}
          </h1>
          <p className="text-sm text-muted-foreground"></p>
        </div>
      </div>

      <div>coming soon...</div>
    </div>
  );
}
