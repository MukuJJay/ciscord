import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  try {
    if (req.method !== "PATCH" && req.method !== "DELETE") {
      return res.status(405).json({ error: "Method not allowed!" });
    }

    const profile = await currentProfilePages(req);
    const { messageId, channelId, serverId } = req.query;
    const content = req.body.content;

    if (!content) {
      return res.status(400).json("Content not found!");
    }

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    if (!messageId) {
      return res.status(404).json({ error: "Message ID not found!" });
    }

    if (!channelId) {
      return res.status(404).json({ error: "Channel ID not found!" });
    }

    if (!serverId) {
      return res.status(404).json({ error: "Server ID not found!" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id as string,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
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

    const message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channel.id,
      },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found!" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (req.method === "PATCH") {
      const isOwner = message.memberId === member?.id;

      if (!isOwner) {
        return res.status(401).json({ error: "Unauthorized!" });
      }

      const updatedMessage = await db.message.update({
        where: {
          id: message.id,
          memberId: member.id,
        },
        data: {
          content,
        },
      });

      return res.status(200).json({ data: updatedMessage });
    }

    // return res.json({ data: req.query });
  } catch (error) {
    console.error("[MESSAGES PATCH", error);
    res.status(500).json({ error });
  }
}
