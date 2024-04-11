"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("create.form");

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    songTaskStep: step,
    setSongTaskStep: setStep,
    setSongTask,
  } = useAppContext();

  const fetchGenLyrics = async function (description: string) {
    try {
      const params = {
        description,
      };

      setLoading(true);
      const resp = await fetch("/api/gen-song-lyrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      setLoading(false);

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      console.log("gen song lyrics:", data);
      setSongTask(data || {});
      setStep(2);
    } catch (e) {
      setLoading(false);

      console.log("gen lyrics failed:", e);
      toast.error("generate lyrics failed");
    }
  };

  const handleSubmit = async function () {
    if (!description) {
      toast.error("please input song description");
      return;
    }

    fetchGenLyrics(description);
  };

  return (
    <div>
      <div className="mt-4">
        <p className="text-sm text-base-content">{t("description")}</p>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("description_placeholder")}
          className="mt-2"
        />
      </div>

      <div className="mt-4">
        <Button
          className="cursor-pointer"
          disabled={loading}
          onClick={handleSubmit}
        >
          {t("genlyrics")}
        </Button>
      </div>
    </div>
  );
}
