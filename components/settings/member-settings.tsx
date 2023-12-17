import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldOff,
  ShieldQuestion,
} from "lucide-react";

import { Member, MemberRole, Server } from "@prisma/client";

interface MemberSettingsProps {
  member: Member;
  role: string;
}

export const MemberSettings = ({ member, role }: MemberSettingsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left">
        {role === MemberRole.ADMIN && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <ShieldQuestion className="w-4 h-4" />
                <span className="font-bold">Role</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-semibold">GUEST</span>
                    {member.role === MemberRole.GUEST ? (
                      <Check className="w-4 h-4" />
                    ) : null}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer text-emerald-500">
                    <ShieldCheck className="w-4 h-4 " />
                    <span className="text-xs font-semibold">MODERATOR</span>
                    {member.role === MemberRole.MODERATOR ? (
                      <Check className="w-4 h-4" />
                    ) : null}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-rose-500">
          <ShieldOff className="w-4 h-4" />
          <span>Kick</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
