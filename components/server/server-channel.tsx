"use client";

import { Edit, Lock, Plus, Trash } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";

import { Channel, ChannelType, MemberRole } from "@prisma/client";

import { ModalType, useModal } from "@/hooks/user-modal-store";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const params = useParams();

  const channelOnClick = (channelId: string) => {
    router.push(`/servers/${params?.serverId}/channels/${channelId}`);
  };

  const actionClick = (
    event: React.MouseEvent,
    modalName: ModalType,
    channel: Channel
  ) => {
    event.stopPropagation();
    onOpen(modalName, { channel });
  };

  return (
    <div className="px-2 py-3 w-full">
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

      <div className="flex flex-col gap-1">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={cn(
              "flex items-center gap-1 group cursor-pointer p-2 hover:bg-zinc-600/30 rounded-md transition",
              params?.channelId === channel.id && "bg-zinc-600/30"
            )}
            onClick={() => channelOnClick(channel?.id)}
          >
            {icon}
            <ActionTooltip label={channel.name} side="right" duration={700}>
              <span className="text-sm line-clamp-1">
                {channel.name.slice(0, 17)}
                {channel.name.length > 17 && "..."}
              </span>
            </ActionTooltip>

            <div className="ml-auto">
              {channel.name === "general" && <Lock className="w-4 h-4" />}
              {role !== MemberRole.GUEST && channel.name !== "general" && (
                <div
                  className={cn(
                    "group-hover:flex items-center hidden gap-2 transition",
                    params?.channelId === channel.id && "flex"
                  )}
                >
                  <ActionTooltip label="Edit" side="top">
                    <Edit
                      className="w-4 h-4 text-orange-500 "
                      onClick={(event) =>
                        actionClick(event, "editChannel", channel)
                      }
                    />
                  </ActionTooltip>
                  <ActionTooltip label="delete" side="top">
                    <Trash
                      className="w-4 h-4 text-rose-500 "
                      onClick={(event) =>
                        actionClick(event, "editChannel", channel)
                      }
                    />
                  </ActionTooltip>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
