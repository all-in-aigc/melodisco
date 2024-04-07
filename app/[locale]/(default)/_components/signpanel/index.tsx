"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("user");
  const { isShowSignPanel, setIsShowSignPanel } = useAppContext();

  return (
    <Dialog open={isShowSignPanel} onOpenChange={setIsShowSignPanel}>
      <DialogContent className="w-[80%] mx-auto bg-base-200 border-base-300 rounded-md">
        <DialogHeader className="border-b border-base-300 pb-2">
          <DialogTitle>{t("sign_in")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            className="flex items-center gap-x-2 bg-neutral text-neutral-content"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="text-xl" />
            Google
          </Button>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
