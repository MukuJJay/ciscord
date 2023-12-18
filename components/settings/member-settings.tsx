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

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { Dispatch } from "react";
import { useRouter } from "next/navigation";
import { ModalData, ModalType } from "@/hooks/user-modal-store";

interface MemberSettingsProps {
  member: Member & { profile: Profile };
  role: string;
  setLoadingId: Dispatch<string>;
  server: Server;
  onOpen: (type: ModalType, data?: ModalData) => void;
}

export const MemberSettings = ({
  member,
  role,
  setLoadingId,
  server,
  onOpen,
}: MemberSettingsProps) => {
  const router = useRouter();

  const onRoleChange = async (memberRole: string) => {
    try {
      setLoadingId(member.profile.id);

      const url = qs.stringifyUrl({
        url: `/api/member/${member.id}`,
        query: {
          serverId: server.id,
        },
      });

      const response = await axios.patch(url, { role: memberRole });

      router.refresh();

      onOpen("members", { server: response.data, role });
    } catch (error) {
      console.log("[Update Role API]", error);
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async () => {
    try {
      setLoadingId(member.id);

      const url = qs.stringifyUrl({
        url: `/api/member/${member.id}`,
        query: {
          serverId: server.id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();

      onOpen("members", { server: response.data, role });
    } catch (error) {
      console.log("[Kick Member API]", error);
    } finally {
      setLoadingId("");
    }
  };

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
                  <DropdownMenuItem
                    className="flex items-center gap-2 p-2 cursor-pointer"
                    onClick={() => {
                      onRoleChange(MemberRole.GUEST);
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-semibold">
                      {MemberRole.GUEST}
                    </span>
                    {member.role === MemberRole.GUEST ? (
                      <Check className="w-4 h-4" />
                    ) : null}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 p-2 cursor-pointer text-emerald-500"
                    onClick={() => {
                      onRoleChange(MemberRole.MODERATOR);
                    }}
                  >
                    <ShieldCheck className="w-4 h-4 " />
                    <span className="text-xs font-semibold">
                      {MemberRole.MODERATOR}
                    </span>
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

        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer text-rose-500"
          onClick={onKick}
        >
          <ShieldOff className="w-4 h-4" />
          <span>Kick</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
