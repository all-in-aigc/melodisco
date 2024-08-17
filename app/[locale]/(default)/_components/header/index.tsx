"use client";

import { Divide, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Locales from "../locales";
import Policy from "../policy";
import Producthunt from "../producthunt";
import Sidenav from "../sidenav";
import Sidepanel from "../sidepanel";
import Social from "../social";
import Theme from "../theme";
import User from "../user";
import { useAppContext } from "@/contexts/app";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("pricing");
  const {
    theme,
    isSiderOpen,
    setIsSiderOpen,
    user,
    userCredits,
    setUserCredits,
  } = useAppContext();

  const fetchUserCredits = async function () {
    try {
      const resp = await fetch("/api/get-user-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { code, message, data } = await resp.json();
      console.log("user credits", data);
      if (data) {
        setUserCredits(data);
      }
    } catch (e) {
      console.log("get user credits failed:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserCredits();
      console.log("user", user);
    }
  }, [user]);

  return (
    <header className="flex h-16 left-0 right-0 fixed bg-base-100 z-50 items-center gap-4 border-b border-base-300 px-4 lg:h-[80px] lg:px-6">
      <Sheet open={isSiderOpen} onOpenChange={setIsSiderOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-base-200 border-base-300 shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" onClick={() => setIsSiderOpen(true)} />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col py-8 px-4 bg-base-200 border-base-300 overflow-y-auto"
          data-theme={theme}
        >
          <Sidenav />
          <div className="">
            <Sidepanel />
            <Social />
            <Policy />
          </div>
        </SheetContent>
      </Sheet>

      <div className="mr-8">
        <Link href="/" className="flex items-center gap-x-2 font-semibold">
          <img src="/logo.png" className="w-16 h-16" />
          <span className="hidden md:block text-2xl font-medium">
            Melodisco
          </span>
        </Link>
      </div>

      <div className="hidden md:block">
        {/* <Link href={"/pricing"}>{t("title")}</Link> */}
        {/* <a
          href="https://heybeauty.ai"
          target="_blank"
          className="text-primary pl-8"
        >
          HeyBeauty AI Try-On
        </a> */}
      </div>

      <div className="hidden md:block md:ml-8">{/* <Producthunt /> */}</div>

      <div className="w-full flex-1">
        {/* <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search music..."
              className="w-full appearance-none bg-base-200 border-base-300 pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form> */}
      </div>

      {userCredits && (
        <Link href={"/pricing"} className="mr-2">
          {t("credits")}:
          <span className="text-primary ml-2">{userCredits.left_credits}</span>
        </Link>
      )}

      <Theme />

      <div className="hidden md:block">
        <Locales />
      </div>

      <User />
    </header>
  );
}
