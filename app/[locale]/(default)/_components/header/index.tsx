"use client";

import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { AppContext } from "@/contexts/app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Locales from "../locales";
import { Nav } from "@/types/nav";
import { ReactNode } from "react";
import Sidenav from "../sidenav";
import Sidepanel from "../sidepanel";
import Social from "../social";
import Theme from "../theme";
import User from "../user";
import { useContext } from "react";
import { usePathname } from "next/navigation";

export default function () {
  const { user } = useContext(AppContext);
  const pathname = usePathname();
  const navigations: Nav[] = [];

  return (
    <header className="flex h-16 left-0 right-0 fixed bg-base-100 z-50 items-center gap-4 border-b border-base-300 px-4 lg:h-[80px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-base-200 border-base-300 shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <Sidenav />
          <div className="mt-auto mb-40">
            <Sidepanel />
          </div>
        </SheetContent>
      </Sheet>

      <div className="mr-8">
        <Link href="/" className="flex items-center gap-x-2 font-semibold">
          <img src="/logo.png" className="w-16 h-16" />
          <span className="hidden md:block text-3xl font-bold">Melodisco</span>
        </Link>
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
      <Locales />
      <User />
    </header>
  );
}
