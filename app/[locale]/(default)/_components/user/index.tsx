"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { useContext, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("user");
  const { data: session } = useSession();
  const { user, setUser } = useAppContext();

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.avatar_url} alt={user.nickname} />
              <AvatarFallback>{user.nickname}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mx-4 bg-base-100 text-base-content border-base-300">
            <DropdownMenuLabel className="text-center truncate">
              {user.nickname ? user.nickname : user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-base-200" />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("sign_out")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => signIn("google")}>{t("sign_in")}</Button>
      )}
    </>
  );
}
