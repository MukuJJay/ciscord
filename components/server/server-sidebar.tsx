import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";
import { searchChannelOrMember } from "@/types";

import {
  AudioWaveform,
  Hash,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Video,
} from "lucide-react";
import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const role = server.members.find(
    (member) => member.profile.id === profile.id
  )?.role;

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server.members.filter(
    (member) => member.profile.id !== profile.id
  );

  const channelIconMap = {
    [ChannelType.TEXT]: <Hash className="w-4 h-4" />,
    [ChannelType.AUDIO]: <AudioWaveform className="w-4 h-5" />,
    [ChannelType.VIDEO]: <Video className="w-4 h-4" />,
  };

  const roleIconMap = {
    [MemberRole.ADMIN]: <ShieldPlus className="w-4 h-4 text-rose-500" />,
    [MemberRole.MODERATOR]: (
      <ShieldCheck className="w-4 h-4 text-emerald-500" />
    ),
    [MemberRole.GUEST]: <Shield className="w-4 h-4 " />,
  };

  const serverSearchPropData = [
    {
      label: "Text Channels",
      type: searchChannelOrMember.channel,
      eachData: textChannels.map((channel) => ({
        id: channel?.id,
        name: channel?.name,
        icon: channelIconMap[channel.type],
      })),
    },
    {
      label: "Voice Channels",
      type: searchChannelOrMember.channel,
      eachData: audioChannels.map((channel) => ({
        id: channel?.id,
        name: channel?.name,
        icon: channelIconMap[channel.type],
      })),
    },
    {
      label: "Video Channels",
      type: searchChannelOrMember.channel,
      eachData: videoChannels.map((channel) => ({
        id: channel?.id,
        name: channel?.name,
        icon: channelIconMap[channel.type],
      })),
    },
    {
      label: "Members",
      type: searchChannelOrMember.member,
      eachData: members.map((member) => ({
        id: member?.id,
        name: member?.profile.name,
        icon: roleIconMap[member.role],
      })),
    },
  ];

  return (
    <div>
      <ServerHeader server={server} role={role} />
      <ServerSearch data={serverSearchPropData} />
    </div>
  );
};
