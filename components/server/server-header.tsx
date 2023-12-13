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

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  const isGuest = role !== MemberRole.ADMIN;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none font-bold">
        <button className="flex w-full justify-between items-center px-3 py-2 border-b-2 border-rose-400 dark:hover:bg-zinc-950/50 hover:bg-zinc-300/50">
          {server.name} <ChevronDown />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {isModerator && (
          <DropdownMenuItem className="text-emerald-500 cursor-pointer font-semibold">
            Invite People <UserPlus2 className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        <Separator className="my-1" />
        {isAdmin && (
          <DropdownMenuItem className=" cursor-pointer font-semibold">
            Server Settings <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className=" cursor-pointer font-semibold">
            Manage Members <Users2 className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className=" cursor-pointer font-semibold">
            Create Channel <Antenna className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        <Separator className="my-1" />
        {isGuest && (
          <DropdownMenuItem className="text-rose-600 cursor-pointer font-semibold">
            Leave Server <FolderOutput className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="text-rose-600 cursor-pointer font-semibold">
            Delete Server <FlameKindling className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
