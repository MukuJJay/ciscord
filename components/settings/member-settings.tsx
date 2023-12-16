import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Member } from "@prisma/client";
import {
  Check,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldOff,
  ShieldQuestion,
} from "lucide-react";

interface MemberSettingsProps {
  member: Member;
}

export const MemberSettings = ({ member }: MemberSettingsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left">
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
                {member.role === "GUEST" ? <Check className="w-4 h-4" /> : null}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer text-emerald-500">
                <ShieldCheck className="w-4 h-4 " />
                <span className="text-xs font-semibold">MODERATOR</span>
                {member.role === "MODERATOR" ? (
                  <Check className="w-4 h-4" />
                ) : null}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-rose-500">
          <ShieldOff className="w-4 h-4" />
          <span>Kick</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
