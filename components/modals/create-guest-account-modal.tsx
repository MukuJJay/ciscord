"use client";

import { useModal } from "@/hooks/user-modal-store";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";

export const CreateGuestAccountModal = () => {
  const { type, data, isOpen, onClose } = useModal();
  const { isLoaded, signUp, setActive } = useSignUp();

  const { created, setCreated } = data;
  const router = useRouter();
  const [modalCreate, setModalCreate] = useState(false);

  const isModalOpen = isOpen && type === "createGuestAccount";

  const onCreate = async () => {
    try {
      onClose();
      if (!signUp || !setActive) {
        return;
      }

      if (setCreated === undefined || created === undefined) {
        return;
      }

      setModalCreate(true);
      setCreated(true);

      await signUp
        .create({
          username: uuidv4(),
          password: "demo_password_123",
        })
        .then((result) => {
          if (result.status === "complete") {
            console.log(result);
            setActive({ session: result.createdSessionId });
            setCreated(true);
            setModalCreate(false); //so that after sign out, we can still create account
          } else {
            setCreated(false);
            setModalCreate(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Create Guest Account!
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          This method gets you a system generated username. The password for
          your guest account is always{" "}
          <span className="font-bold text-emerald-500">demo_password_123</span>.
          You can change the username and password in the profile settings.
        </DialogDescription>
        <DialogFooter>
          <div className="w-full flex justify-around">
            <Button variant={"outline"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={"primary"}
              className="font-bold"
              onClick={onCreate}
              disabled={modalCreate}
            >
              Create
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
