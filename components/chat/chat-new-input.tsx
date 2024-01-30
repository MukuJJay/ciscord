"use client";

import axios from "axios";
import qs from "query-string";
import { Textarea } from "../ui/textarea";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Loader2, Plus } from "lucide-react";
import { useModal } from "@/hooks/user-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";
import { cn } from "@/lib/utils";
import { isDesktop } from "react-device-detect";

interface chatInputProps {
  name: string;
  apiUrl: string;
  query: Record<string, any>;
  type: "conversation" | "channel";
}

export const ChatNewInput = ({ name, apiUrl, query, type }: chatInputProps) => {
  const [isLoading, setIsloading] = useState(false);
  const [content, setContent] = useState("");
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const { onOpen } = useModal();

  const onSubmit = async (event: any) => {
    if (event.key !== "Enter" || event.keyCode !== 13) {
      return;
    }

    const regex = /.*\S+.*/;

    if (!regex.test(content)) {
      return;
    }

    if (event.key === "Enter" && event.shiftKey) {
      return;
    }

    if (isLoading) {
      // for not sending the message while the message is being already sent
      return;
    }

    try {
      setIsloading(true);
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      if (!event.target) {
        return;
      }

      await axios.post(url, { content: event.target.value.trim() });
      setIsloading(false);

      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 relative">
      {!isLoading && (
        <button
          type="button"
          className="absolute left-[20px] top-[27%] p-2 group"
          onClick={(event) => {
            onOpen("messageFile", { apiUrl, query });
          }}
        >
          <Plus className="group-hover:animate-spin-one text-zinc-300 dark:text-zinc-500" />
        </button>
      )}

      {isLoading && (
        <div className="absolute left-[26px] top-[32%]">
          <Loader2 className="w-7 h-7 animate-spin text-zinc-300 dark:text-zinc-500" />
        </div>
      )}
      <Textarea
        rows={1}
        ref={textFieldRef}
        className={cn(
          "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-6 px-14 resize-none scrollbar scrollbar-w-1 scrollbar-thumb-zinc-700 scrollbar-thumb-rounded-sm",
          isLoading ? "dark:text-zinc-500 text-zinc-300" : ""
        )}
        onKeyDown={(e: any) => onSubmit(e)}
        onChange={(e: any) => setContent(e.target.value)}
        value={content}
        placeholder={
          type === "conversation" ? `Message ${name}` : `Message # ${name}`
        }
        autoFocus={isDesktop ? true : false}
        readOnly={isLoading}
      />
      <div className="absolute right-[20px] top-[27%]">
        <EmojiPicker
          onChange={(emoji: string) => {
            setContent(`${content}${emoji}`);
            textFieldRef.current?.focus();
          }}
        />
      </div>
    </div>
  );
};
