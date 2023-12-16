"use client";

import { useModal } from "@/hooks/user-modal-store";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Loader2, Shield, ShieldCheck, ShieldPlus } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { MemberSettings } from "@/components/settings/member-settings";

import { ServerWithMembersWithProfiles } from "@/types";

export const MembersModal = () => {
  const { onOpen, type, data, isOpen, onClose } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";

  const { server } = data as { server: ServerWithMembersWithProfiles };

  const roleIconMap = {
    GUEST: <Shield className="w-5 h-5" />,
    MODERATOR: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    ADMIN: <ShieldPlus className="w-6 h-6 text-rose-500" />,
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Manage Members</DialogTitle>
          <DialogDescription>
            Number of Members : {server?.members.length}
          </DialogDescription>
        </DialogHeader>
        {server?.members.map((member) => {
          const nameArr = member.profile.name.split(" ");
          const shortNameArr = [];
          for (const name of nameArr) {
            if (
              nameArr.indexOf(name) === 0 ||
              nameArr.indexOf(name) === nameArr.length - 1
            ) {
              shortNameArr.push(name.slice(0, 1));
            }
          }

          return (
            <div key={member.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={member.profile.imageUrl} />
                    <AvatarFallback>{shortNameArr.join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[14px]">{member.profile.name}</p>
                    <p className="text-xs text-indigo-400">
                      {member.profile.email}
                    </p>
                  </div>
                  <ActionTooltip
                    label={member.role}
                    side="right"
                    align="center"
                  >
                    {roleIconMap[member.role]}
                  </ActionTooltip>
                </div>
                {server.profileId !== member.profile.id &&
                  loadingId !== member.profile.id && (
                    <MemberSettings member={member} />
                  )}
                {loadingId === member.profile.id && (
                  <Loader2 className="animate-spin" />
                )}
              </div>
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};
