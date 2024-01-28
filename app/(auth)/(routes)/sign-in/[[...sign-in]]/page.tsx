"use client";

import { SignIn, useSignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModal } from "@/hooks/user-modal-store";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [created, setCreated] = useState(false);
  const [status, setStatus] = useState("");

  const { isLoaded } = useSignIn();

  const router = useRouter();
  const { onOpen } = useModal();

  if (created) {
    router.push("/");
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      {!created && (
        <Button
          onClick={() => onOpen("createGuestAccount", { created, setCreated })}
          variant={"primary"}
          className="w-[90%] font-bold text-white"
          disabled={created}
        >
          Continue With Guest Account
        </Button>
      )}
      {!created && <SignIn />}
      {created && <Loader2 className="animate-spin w-12 h-12" />}
    </div>
  );
}
