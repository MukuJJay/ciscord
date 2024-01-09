import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { Smile } from "lucide-react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 group">
          <Smile className="group-hover:text-zinc-800 dark:group-hover:text-zinc-200 text-zinc-300 dark:text-zinc-500 transition" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Picker
          data={data}
          theme={resolvedTheme}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
