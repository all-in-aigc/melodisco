"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, usePathname, useRouter } from "next/navigation";

import { MdLanguage } from "react-icons/md";
import { localeNames } from "@/configs/locale";

export default function () {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitchLanguage = (value: string) => {
    if (value !== locale) {
      let newPathName = pathname.replace(`/${locale}`, `/${value}`);
      if (!newPathName.startsWith(`/${value}`)) {
        newPathName = `/${value}${newPathName}`;
      }
      router.push(newPathName);
    }
  };

  return (
    <Select value={locale} onValueChange={handleSwitchLanguage}>
      <SelectTrigger className="w-fit bg-base-100 text-base-content border-base-200">
        {/* <MdLanguage className="text-xl text-base-content" /> */}
        <SelectValue className="hidden md:block" placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="bg-base-100 text-base-content">
        {Object.keys(localeNames).map((key: string) => {
          const name = localeNames[key];
          return (
            <SelectItem
              className="cursor-pointer hover:bg-base-200"
              key={key}
              value={key}
            >
              {name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
