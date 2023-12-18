"use client";

import { useModal } from "@/hooks/user-modal-store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const LeaveModal = () => {
  const { type, data, isOpen, onClose } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { server } = data;
  const router = useRouter();

  const isModalOpen = isOpen && type === "leave";

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/server/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("[LEAVE SERVER]", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Leave Server!</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          Are you sure to leave{" "}
          <span className="font-semibold text-indigo-500">{server?.name}</span>?
        </DialogDescription>
        <DialogFooter>
          <div className="w-full flex justify-around">
            <Button variant={"outline"} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant={"primary"}
              className="font-bold"
              disabled={isLoading}
              onClick={onSubmit}
            >
              Leave
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
