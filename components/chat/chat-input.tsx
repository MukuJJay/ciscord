"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import qs from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/user-modal-store";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/emoji-picker";
import { Plus } from "lucide-react";

interface chatInputProps {
  name: string;
  apiUrl: string;
  query: Record<string, any>;
  type: "conversation" | "channel";
}

export const ChatInput = ({ name, apiUrl, query, type }: chatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const formSchema = z.object({
    content: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);

      form.reset();
      // router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="dark:bg-zinc-900 p-4 rounded flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <button
                    type="button"
                    className="absolute left-0 top-[50%] translate-y-[-50%] p-2 group"
                    onClick={(event) => {
                      onOpen("messageFile", { apiUrl, query });
                    }}
                  >
                    <Plus className="group-hover:animate-spin-one text-zinc-300 dark:text-zinc-500" />
                  </button>
                  <Input
                    {...field}
                    disabled={isLoading}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-6 px-14"
                    placeholder={
                      type === "conversation"
                        ? `Message ${name}`
                        : `Message # ${name}`
                    }
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
      </form>
    </Form>
  );
};
