"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useModal } from "@/hooks/user-modal-store";
import { ChannelType } from "@prisma/client";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export const CreateChannelModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const router = useRouter();
  const params = useParams();

  const { channelType } = data;

  const isModalOpen = isOpen && type === "createChannel";

  const formSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: "Server name is required!",
      })
      .refine((name) => name !== "general", {
        message: "'general' is a reserved channel name!",
      }),
    type: z.nativeEnum(ChannelType),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (channelType) {
      form.setValue("type", channelType);
    }
  }, [channelType, form]);

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channel",
        query: {
          serverId: params.serverId,
        },
      });

      await axios.post(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error, "[CHANNEL-POST]");
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Create a new channel
          </DialogTitle>
          {/* <DialogDescription className="!mt-3">
            Customize your server by adding a name and an image. This server
            settings can always be changed later.
          </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="dark:bg-zinc-900 p-4 rounded flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter server name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Type</FormLabel>
                  <Select
                    disabled={isLoading}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className=" focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Select a channel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ChannelType).map((elem) => {
                        return (
                          <SelectItem key={elem} value={elem}>
                            {elem}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button
                variant={"primary"}
                className="font-bold"
                disabled={isLoading}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
