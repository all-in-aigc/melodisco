"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("user");

  return (
    <Card className="w-full max-w-sm bg-base-100 border-base-300 text-base-content">
      <CardHeader className="border-b border-base-300 pb-4 mb-8">
        <CardTitle className="text-2xl mx-auto">{t("sign_in")}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="grid">
        <div className="grid gap-4 py-4">
          <Button
            className="flex items-center gap-x-2 bg-neutral text-neutral-content"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="text-xl" />
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
