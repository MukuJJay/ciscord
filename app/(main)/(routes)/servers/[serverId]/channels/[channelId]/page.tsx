import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
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

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        channelName={channel?.name}
        serverId={serverId}
        type="channel"
      />
      <div className="flex-1">Future Messages</div>
      <ChatInput
        name={channel?.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{ channelId, serverId }}
      />
    </div>
  );
};

export default ChannelIdPage;
