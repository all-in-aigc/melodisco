"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";

export default function () {
  const styles = [
    {
      label: "rock",
      value: "rock",
    },
    {
      label: "electronic",
      value: "electronic",
    },
    {
      label: "pop",
      value: "pop",
    },
    {
      label: "jazz",
      value: "jazz",
    },
    {
      label: "classical",
      value: "classical",
    },
    {
      label: "hip hop",
      value: "hip hop",
    },
    {
      label: "pop rock",
      value: "pop rock",
    },
    {
      label: "indie rock",
      value: "indie rock",
    },
    {
      label: "alternative rock",
      value: "alternative rock",
    },
    {
      label: "folk",
      value: "folk",
    },
    {
      label: "punk",
      value: "punk",
    },
    {
      label: "blues",
      value: "blues",
    },
    {
      label: "experimental",
      value: "experimental",
    },
    {
      label: "ambient",
      value: "ambient",
    },
    {
      label: "synth-pop",
      value: "synth-pop",
    },
    {
      label: "hard rock",
      value: "hard rock",
    },
    {
      label: "downtempo",
      value: "downtempo",
    },
    {
      label: "heavy metal",
      value: "heavy metal",
    },
    {
      label: "house",
      value: "house",
    },
    {
      label: "electro",
      value: "electro",
    },
    {
      label: "soul",
      value: "soul",
    },
    {
      label: "country",
      value: "country",
    },
    {
      label: "folk rock",
      value: "folk rock",
    },
    {
      label: "melodic",
      value: "melodic",
    },
    {
      label: "latin",
      value: "latin",
    },
  ];

  const router = useRouter();
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [mode, setMode] = useState("quick");
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isNoLyrics, setIsNoLyrics] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    songTaskStep: step,
    setSongTaskStep: setStep,
    setSongTask,
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

  const fetchGenLyrics = async function (description: string) {
    try {
      const params = {
        description,
        tags: tags.join(","),
        is_no_lyrics: isNoLyrics,
        lyrics: lyrics,
        title: title,
        mode: mode,
      };
      console.log("params", params);

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

      fetchUserCredits();

      console.log("gen song result:", data);
      setSongTask(data || {});

      router.push("/creations");
    } catch (e) {
      setLoading(false);

      console.log("gen song failed:", e);
      toast.error("generate song failed");
    }
  };

  const handleSubmit = async function () {
    if (mode === "custom") {
      if (!title) {
        toast.error("please input song title");
        return;
      }
      if (!isNoLyrics && !lyrics) {
        toast.error("please input song lyrics");
        return;
      }
      if (tags.length === 0) {
        toast.error("please choose music style");
        return;
      }
      if (tags.length > 5) {
        toast.error("music style no more than 5 tags");
        return;
      }
    } else {
      if (!description) {
        toast.error("please input song description");
        return;
      }
    }

    if (!userCredits || userCredits.left_credits < 1) {
      toast.error("credits not enough");
      return;
    }

    fetchGenLyrics(description);
  };

  useEffect(() => {
    console.log("tags updated", tags);
  }, [tags]);

  return (
    <Tabs value={mode} onValueChange={(v) => setMode(v)} className="max-w-3xl">
      <TabsList className="grid w-full grid-cols-2 bg-base-200">
        <TabsTrigger value="quick">Quick Mode</TabsTrigger>
        <TabsTrigger value="custom">Custom Mode</TabsTrigger>
      </TabsList>
      <TabsContent value="quick">
        <div>
          <div className="mt-4">
            <p className="text-sm text-base-content">Song Description</p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`a song about driving on the road`}
              className="mt-2 bg-base-200 border-base-300"
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="custom">
        <div className="mt-4">
          <p className="text-sm text-base-content">Song Title</p>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Five Hundred Miles`}
            className="mt-4 bg-base-200 border-base-300"
          />
        </div>

        {!isNoLyrics && (
          <div className="mt-4">
            <p className="text-sm text-base-content">Lyrics</p>
            <Textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder={`Your custom lyrics`}
              className="mt-2 bg-base-200 border-base-300"
              rows={2}
            />
          </div>
        )}
      </TabsContent>

      <div className="mt-4">
        <p className="text-sm text-base-content">Style of Music</p>
        <p className="flex items-center gap-x-2 flex-wrap py-4">
          {styles.map((v: any, idx: number) => {
            const tag: string = v["value"];
            if (!tag) {
              return;
            }

            return (
              <span
                className={`bg-base-300 text-sm px-2 py-0 my-1 text-nowrap rounded-full cursor-pointer ${
                  tags.includes(tag) ? "bg-primary" : ""
                }`}
                aria-disabled={tags.includes(tag)}
                key={idx}
                onClick={() => {
                  setTags((tags: string[]) => {
                    if (tags.includes(tag)) {
                      const pos = tags.indexOf(tag);
                      if (pos !== -1) {
                        tags.splice(tags.indexOf(tag), 1);
                      }
                    } else {
                      tags.push(tag);
                    }
                    console.log("tags", tags);

                    return [...tags];
                  });
                }}
              >
                {v["label"]}
              </span>
            );
          })}
        </p>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Switch
          checked={isNoLyrics}
          onCheckedChange={(v) => setIsNoLyrics(v)}
          className="bg-base-200"
        />
        <Label htmlFor="airplane-mode">No Lyrics</Label>
      </div>

      <div className="mt-4">
        <Button
          className="cursor-pointer"
          disabled={loading}
          onClick={handleSubmit}
        >
          Create Song
        </Button>
      </div>

      {userCredits && userCredits.left_credits < 1 && (
        <div className="mt-4">
          <Link href="/pricing" className="text-primary underline text-sm">
            credits not enough, please recharge
          </Link>
        </div>
      )}
    </Tabs>
  );
}
