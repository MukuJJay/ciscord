"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "../modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { ServerSettingsModal } from "@/components/modals/server-settings-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveModal } from "@/components/modals/leave-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <ServerSettingsModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveModal />
    </>
  );
};
