import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerPage = async ({ params }: { params: { serverId: string } }) => {
  const profile = await currentProfile();
  if (!profile) {
    redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params?.serverId,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
    include: {
      channels: true,
    },
  });

  if (!server) {
    return null;
  }

  const generalChannelId = server?.channels.find(
    (channel) => channel.name === "general"
  )?.id;

  return redirect(`/servers/${server?.id}/channels/${generalChannelId}`);
};

export default ServerPage;
