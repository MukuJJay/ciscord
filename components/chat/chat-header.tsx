import { Hash } from "lucide-react";
import { NavServerSidebarToggle } from "@/components/mobile/navbar-serverSidebar-toggle";
import { MembersToggle } from "@/components/mobile/members-toggle";

interface ChatHeaderProps {
  channelName: string;
  serverId: string;
  type: "channel" | "member";
}

export const ChatHeader = ({
  channelName,
  serverId,
  type,
}: ChatHeaderProps) => {
  return (
    <div className="px-3 py-2 border-b-2 flex items-center gap-4">
      <div className="mdm:hidden">
        <NavServerSidebarToggle serverId={serverId} />
      </div>

      <p className="flex items-center gap-1">
        {type === "channel" && <Hash className="w-5 h-5" />}
        {channelName}
      </p>
      <div className="ml-auto mdm:hidden">
        <MembersToggle serverId={serverId} />
      </div>
    </div>
  );
};
