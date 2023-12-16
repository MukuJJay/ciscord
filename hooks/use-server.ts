import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const useServer = async () => {
  const profile = await currentProfile();
  if (!profile) return null;

  const currentUrl = new URL(window.location.href);
  const serverId = currentUrl.pathname.split("/servers/")[1];

  if (!serverId) return null;

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

  if (server) return { server, profile };
};
