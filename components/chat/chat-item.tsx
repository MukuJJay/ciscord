import { Member, MemberRole, Profile } from "@prisma/client";
import { useState } from "react";
import { useModal } from "@/hooks/user-modal-store";
import { format } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import {
  Edit,
  FileText,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Trash2,
} from "lucide-react";
import { ChatReply } from "./chat-reply";

interface ChatItemProps {
  id: string;
  content: string;
  fileUrl: string | null;
  currentMember: Member;
  member: Member & { profile: Profile };
  createdAt: Date;
  updatedAt: Date;
  socketUrl: string;
  socketQuery: Record<string, string>;
  deleted: boolean;
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldPlus className="w-4 h-4 text-rose-500" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
  [MemberRole.GUEST]: <Shield className="w-4 h-4 " />,
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export const ChatItem = ({
  id,
  content,
  fileUrl,
  currentMember,
  member,
  createdAt,
  updatedAt,
  socketUrl,
  socketQuery,
  deleted,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isEdited = updatedAt !== createdAt;
  const timestamp = format(new Date(updatedAt), DATE_FORMAT);
  const fileType = fileUrl?.split(".").pop();
  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;

  return (
    <div className="relative flex gap-4 px-8 sm:px-3 md:px-5 py-4 group hover:bg-zinc-300/50 hover:dark:bg-zinc-950/50">
      <div>
        <Avatar>
          <AvatarImage src={member.profile.imageUrl} />
          <AvatarFallback>{member.profile.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2 cursor-default">
          <ActionTooltip label={member.profile.name} duration={500}>
            <p className="text-sm font-semibold ">
              {member.profile.name.slice(0, 20)}
              {member.profile.name.length > 20 && "..."}
            </p>
          </ActionTooltip>
          <ActionTooltip label={member.role}>
            {roleIconMap[member.role]}
          </ActionTooltip>
          <span className="text-xs text-zinc-500">{timestamp}</span>
        </div>

        <div className={cn(fileUrl ? "mt-3" : "")}>
          {!fileUrl && isEditing && !deleted && (
            <ChatReply
              messageId={id}
              content={content}
              socketUrl={socketUrl}
              socketQuery={socketQuery}
              setIsEditing={setIsEditing}
            />
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300 break-all",
                deleted ? "italic text-xs text-zinc-400 dark:text-zinc-500" : ""
              )}
            >
              {content}{" "}
              {isEdited && !deleted && (
                <span className="text-zinc-500 text-xs italic">(edited)</span>
              )}
            </p>
          )}
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              className="flex justify-center items-center relative aspect-square w-48 h-48 ml-4 bg-zinc-500 dark:bg-zinc-800 rounded-md"
            >
              <Image
                src={fileUrl}
                alt={fileUrl}
                fill
                className="object-cover"
              />
            </a>
          )}

          {isPdf && (
            <div className="relative">
              <a
                className=" w-full p-5 text-indigo-400 hover:bg-zinc-800/20 flex items-center gap-2"
                href={fileUrl}
                target="_blank"
              >
                <FileText className="w-8 h-8" />
                <span className="text-sm italic">{fileUrl}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {canDeleteMessage && !deleted && (
        <div className="hidden group-hover:flex items-center gap-1 absolute z-10 top-[-8px] right-10 dark:text-zinc-500 text-zinc-400 bg-zinc-50 dark:bg-zinc-950 rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="edit" duration={400}>
              <div
                className="p-[6px] cursor-pointer hover:bg-zinc-300 hover:dark:bg-zinc-800 rounded-sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" />
              </div>
            </ActionTooltip>
          )}
          <ActionTooltip label="delete" duration={400}>
            <div
              className="p-[6px] cursor-pointer hover:bg-zinc-300 hover:dark:bg-zinc-800 rounded-sm"
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: socketUrl,
                  query: { ...socketQuery, messageId: id },
                })
              }
            >
              <Trash2 className="w-4 h-4" />
            </div>
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
