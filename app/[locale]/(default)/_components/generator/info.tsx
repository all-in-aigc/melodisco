"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("create.form");
  const {
    songTask: task,
    setSongTask,
    setSongTaskStep: setStep,
  } = useAppContext();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [tags, setTags] = useState("");
  const [isNoLyrics, setIsNoLyrics] = useState(false);
  const [model, setModel] = useState("chirp-v3-0");
  const [taskUuid, setTaskUuid] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async function () {
    if (!taskUuid || !description) {
      toast.error("invalid params");
      return;
    }

    try {
      const params = {
        task_uuid: taskUuid,
        description: description,
        title: title,
        lyrics: lyrics,
        is_no_lyrics: isNoLyrics,
        tags: tags,
        model: model,
      };

      setLoading(true);
      const resp = await fetch("/api/gen-song", {
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

      if (data) {
        setSongTask(data);
        setStep(3);
      }
    } catch (e) {
      console.log("gen song failed");
    }
  };

  useEffect(() => {
    if (task) {
      setTaskUuid(task.uuid);
      setDescription(task.description);
      setTitle(task.title);
      setLyrics(task.lyrics);
      setTags(task.tags);
      setModel(task.model || "chirp-v3-0");
    }
  }, [task]);

  const models: any = {
    "chirp-v3-0": "Suno V3",
  };

  return (
    <>
      {task ? (
        <div>
          <div className="mt-4">
            <p className="text-sm text-base-content">{t("title")}</p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("title_placeholder")}
              className="mt-4"
            />
          </div>

          <div className="mt-4">
            <p className="text-sm text-base-content">{t("lyrics")}</p>
            <Textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder={t("lyrics_placeholder")}
              className="mt-2"
              rows={2}
            />
          </div>

          <div className="mt-4">
            <p className="text-sm text-base-content">{t("tags")}</p>
            <Textarea
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={t("tags_placeholder")}
              className="mt-2"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={isNoLyrics}
              onCheckedChange={(v) => setIsNoLyrics(v)}
            />
            <Label htmlFor="airplane-mode">{t("nolyrics")}</Label>
          </div>

          <div className="mt-4">
            <p className="text-sm text-base-content">{t("model")}</p>
            <div className="mt-2">
              <Select value={model} onValueChange={(v) => setModel(v)}>
                <SelectTrigger className="w-fit bg-base-100 text-base-content border-base-200">
                  <SelectValue
                    className="hidden md:block"
                    placeholder={t("model")}
                  />
                </SelectTrigger>
                <SelectContent className="bg-base-100 text-base-content">
                  {Object.keys(models as any).map((key: string) => {
                    const name = models[key];

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
            </div>
          </div>

          <div className="mt-4">
            <Button
              className="cursor-pointer"
              onClick={handleSubmit}
              disabled={loading}
            >
              {t("gensong")}
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
