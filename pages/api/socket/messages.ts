import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed!" });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { channelId, serverId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required!" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "channel ID is required!" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required!" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found!" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found!" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found!" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id,
        memberId: member.id,
      },
    });

    return res.status(200).json({ data: message });
  } catch (error) {
    console.error("[MESSAGES POST]", error);
  }
}
