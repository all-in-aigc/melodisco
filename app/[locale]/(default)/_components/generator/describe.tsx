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

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function () {
  return (
    <div>
      <h2 className="border-b border-base-200 py-4 text-lg font-bold">
        #1. Describe Song
      </h2>

      <div className="mt-4">
        <p className="text-sm text-base-content">Song Description</p>
        <Textarea
          placeholder="Describe the song you want to create."
          className="mt-2"
        />
      </div>

      <div className="mt-4">
        <p className="text-sm text-base-content">Song Language</p>
        <div className="mt-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>English</SelectLabel>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <Button className="cursor-pointer">Generate Lyric</Button>
      </div>
    </div>
  );
}
