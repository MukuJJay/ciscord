import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import qs from "query-string";
import axios from "axios";

import { Form, FormField, FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "../emoji-picker";

interface ChatReplyProps {
  messageId: string;
  content: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

export const ChatReply = ({
  messageId,
  content,
  setIsEditing,
  socketUrl,
  socketQuery,
}: ChatReplyProps) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsEditing]);

  const formSchema = z.object({
    content: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${messageId}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      setIsEditing(false);
    } catch (error) {
      console.error("[CHAT_REPLY_PATCH", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="dark:bg-zinc-900 p-2 rounded flex flex-col gap-2 w-full"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={isLoading}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-5 pl-5 pr-10"
                    autoFocus
                  />
                  <div className="absolute right-0 top-[50%] translate-y-[-50%]">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value}${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <p className="text-xs text-zinc-500">
          Press <span className="text-indigo-500">'ESC'</span> to close the
          editing panel.
        </p>
      </form>
    </Form>
  );
};
