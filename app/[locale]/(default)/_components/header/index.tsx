"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Locales from "../locales";
import { Menu } from "lucide-react";
import Policy from "../policy";
import Producthunt from "../producthunt";
import Sidenav from "../sidenav";
import Sidepanel from "../sidepanel";
import Social from "../social";
import Theme from "../theme";
import User from "../user";
import { useAppContext } from "@/contexts/app";

export default function () {
  const { theme, isSiderOpen, setIsSiderOpen } = useAppContext();

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
          className="flex flex-col py-8 px-4 bg-base-200 border-base-300"
          data-theme={theme}
        >
          <Sidenav />
          <div className="px-4 pb-8">
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

      <div className="hidden md:block md:ml-8">
        <Producthunt />
      </div>

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

      <Theme />

      <div className="hidden md:block">
        <Locales />
      </div>

      <User />
    </header>
  );
}
