import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { VideoRoom } from "@/components/room/video-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const { serverId, channelId } = params;
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!serverId || !channelId) {
    return null;
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) return redirect("/");

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!member) return redirect("/");

  if (channel?.type === ChannelType.TEXT) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader
          channelName={channel?.name}
          serverId={serverId}
          type="channel"
        />
        <ChatMessages
          name={channel.name}
          type="channel"
          apiUrl="/api/messages"
          chatId={channel.id}
          paramKey="channelId"
          paramValue={channel.id}
          member={member}
          socketUrl="/api/socket/messages"
          socketQuery={{ channelId, serverId }}
        />
        <ChatInput
          name={channel?.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{ channelId, serverId }}
        />
      </div>
    );
  }

  if (channel?.type === ChannelType.VIDEO) {
    return <VideoRoom chatId="channel?.id" />;
  }
};

export default ChannelIdPage;
