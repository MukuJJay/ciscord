"use client";

import { useModal } from "@/hooks/user-modal-store";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Edit, Lock, Plus, Trash } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";

interface ServerChannelProps {
  label: string;
  role?: MemberRole;
  channels: Channel[];
  channelType: ChannelType;
  icon: React.ReactNode;
}

export const ServerChannel = ({
  label,
  role,
  channels,
  channelType,
  icon,
}: ServerChannelProps) => {
  const { onOpen } = useModal();

  return (
    <div className="px-2 py-3 ">
      <div className="flex items-center justify-between pb-2">
        <span className="text-sm dark:text-zinc-300 text-zinc-700 font-semibold cursor-default">
          {label}
        </span>
        <button
          className="cursor-pointer hover:bg-zinc-600/30 p-1 rounded-md transition group"
          onClick={() => onOpen("createChannel", { channelType })}
        >
          <Plus className="w-4 h-4 group-hover:animate-spin-one" />
        </button>
      </div>

      {channels.map((channel) => (
        <div
          key={channel.id}
          className="flex items-center gap-1 group cursor-pointer p-2 hover:bg-zinc-600/30 rounded-md"
        >
          {icon}
          <span className="text-sm">{channel.name}</span>
          <div className="ml-auto">
            {channel.name === "general" && <Lock className="w-4 h-4" />}
            {role !== MemberRole.GUEST && channel.name !== "general" && (
              <div className="group-hover:flex items-center hidden gap-2 transition">
                <ActionTooltip label="Edit" side="top">
                  <Edit className="w-4 h-4 text-orange-500 " />
                </ActionTooltip>
                <ActionTooltip label="delete" side="top">
                  <Trash className="w-4 h-4 text-rose-500 " />
                </ActionTooltip>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
