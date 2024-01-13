"use client";

import { useModal } from "@/hooks/user-modal-store";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteMessageModal = () => {
  const { type, data, isOpen, onClose } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { channel } = data;
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteMessage";

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      //   const url = qs.stringifyUrl({
      //     url: `/api/channel/${channel?.id}`,
      //     query: { serverId: params?.serverId },
      //   });

      //   await axios.delete(url);

      router.refresh();
      onClose();
    } catch (error) {
      console.error("[DELETE SERVER]", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Delete Message!</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          Are you sure to delete? Message{" "}
        </DialogDescription>
        <DialogFooter>
          <div className="w-full flex justify-around">
            <Button variant={"outline"} disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={"primary"}
              className="font-bold"
              disabled={isLoading}
              onClick={onSubmit}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
