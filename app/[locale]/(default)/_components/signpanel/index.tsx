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
import Sign from "../sign";
import { signIn } from "next-auth/react";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("user");
  const { isShowSignPanel, setIsShowSignPanel } = useAppContext();

  return (
    <Dialog open={isShowSignPanel} onOpenChange={setIsShowSignPanel}>
      <DialogContent className="w-[80%] py-16 mx-auto bg-base-200 border-base-300 rounded-md">
        <Sign />
      </DialogContent>
    </Dialog>
  );
}
