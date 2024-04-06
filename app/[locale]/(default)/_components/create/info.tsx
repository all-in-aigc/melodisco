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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function () {
  return (
    <div>
      <h2 className="border-b border-base-200 py-4 text-lg font-bold">
        #2. Style and Lyrics
      </h2>

      <div className="mt-4">
        <p className="text-sm text-base-content">Song Title</p>
        <Input placeholder="song title" className="mt-4" />
      </div>

      <div className="mt-4">
        <p className="text-sm text-base-content">Style</p>
        <div className="mt-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Jazz</SelectLabel>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Pure Music</Label>
      </div>

      <div className="mt-4">
        <p className="text-sm text-base-content">Lyrics</p>
        <Textarea
          placeholder="Describe the song you want to create."
          className="mt-2"
          rows={8}
        />
      </div>

      <div className="mt-4">
        <Button className="cursor-pointer">Create Song</Button>
      </div>
    </div>
  );
}
