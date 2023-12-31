"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Antenna,
  ChevronDown,
  FlameKindling,
  FolderOutput,
  Settings,
  UserPlus2,
  Users2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/user-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none font-bold">
        <button className="flex w-full justify-between items-center px-3 py-2 border-b-2 border-rose-400 dark:hover:bg-zinc-950/50 hover:bg-zinc-300/50">
          {server.name} <ChevronDown />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {isModerator && (
          <DropdownMenuItem
            className="text-emerald-500 cursor-pointer font-semibold"
            onClick={() => onOpen("invite", { server })}
          >
            Invite People <UserPlus2 className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && <Separator className="my-1" />}
        {isAdmin && (
          <DropdownMenuItem
            className=" cursor-pointer font-semibold"
            onClick={() => onOpen("serverSettings", { server })}
          >
            Server Settings <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className=" cursor-pointer font-semibold"
            onClick={() => onOpen("members", { server, role })}
          >
            Manage Members <Users2 className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className=" cursor-pointer font-semibold"
            onClick={() => onOpen("createChannel")}
          >
            Create Channel <Antenna className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && <Separator className="my-1" />}
        {!isAdmin && (
          <DropdownMenuItem
            className="text-rose-600 cursor-pointer font-semibold"
            onClick={() => onOpen("leave", { server })}
          >
            Leave Server <FolderOutput className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="text-rose-600 cursor-pointer font-semibold"
            onClick={() => onOpen("deleteServer", { server })}
          >
            Delete Server <FlameKindling className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
