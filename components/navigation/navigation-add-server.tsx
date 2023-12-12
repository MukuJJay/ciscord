"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";

import { useModal } from "@/hooks/user-modal-store";

const NavigationAddServer = () => {
  const { onOpen } = useModal();

  const handleModalOpen = () => {
    onOpen("createServer");
  };

  return (
    <ActionTooltip side="right" label="Add a server" align="center">
      <button
        onClick={handleModalOpen}
        className="w-[50px] h-[50px] dark:bg-zinc-900 bg-zinc-100 flex items-center justify-center rounded-[24px] hover:rounded-[16px] transition-all hover:bg-emerald-500 dark:hover:bg-emerald-500 group"
      >
        <Plus className="text-emerald-500 group-hover:text-zinc-900 group-hover:animate-spin-one" />
      </button>
    </ActionTooltip>
  );
};

export default NavigationAddServer;
