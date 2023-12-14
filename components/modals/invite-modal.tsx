"use client";

import { useModal } from "@/hooks/user-modal-store";
import { useState } from "react";
import { useOrigin } from "@/hooks/use-origin";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCheck, Copy, RotateCw } from "lucide-react";
import axios from "axios";

export const InviteModal = () => {
  const { onOpen, type, data, isOpen, onClose } = useModal();
  const origin = useOrigin();
  const [copy, setCopy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "invite";
  const inviteUrl = `${origin}/invite/${data?.server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/server/${data?.server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Invite Code</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            value={inviteUrl}
            readOnly
            className="focus-visible:ring-emerald-500 focus-visible:ring-1 focus-visible:ring-offset-1 "
          />
          <Button
            variant={"outline"}
            onClick={onCopy}
            disabled={copy || isLoading}
          >
            {copy ? <CheckCheck /> : <Copy />}
          </Button>
        </div>
        <Button
          variant={"emerald"}
          className="flex gap-2 items-center justify-center uppercase font-bold group"
          onClick={onNew}
          disabled={isLoading}
        >
          Generate A New Invite Link{" "}
          <RotateCw className="group-hover:animate-spin-one" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};
