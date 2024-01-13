import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole, Message } from "@prisma/client";
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
        deleted: false,
      },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found!" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    let UpdatedOrDeletedMessage: Message = message;

    if (req.method === "PATCH") {
      if (!content) {
        return res.status(400).json("Content not found!");
      }
      const isOwner = message.memberId === member?.id;

      if (!isOwner || message.fileUrl) {
        return res.status(401).json({ error: "Unauthorized!" });
      }

      UpdatedOrDeletedMessage = await db.message.update({
        where: {
          id: message.id,
          memberId: member.id,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "DELETE") {
      const isAdmin = member?.role === MemberRole.ADMIN;
      const isModerator = member?.role === MemberRole.MODERATOR;
      const isOwner = message.memberId === member?.id;

      const canDeleteMessage = isAdmin || isModerator || isOwner;

      if (!canDeleteMessage) {
        return res.status(401).json("Unauthorized!");
      }

      if (message.deleted) {
        return res.status(404).json("Message not found!");
      }

      UpdatedOrDeletedMessage = await db.message.update({
        where: {
          id: message.id,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted!",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:message:update`;
    res?.socket?.server?.io?.emit(updateKey, UpdatedOrDeletedMessage);

    return res.status(200).json({ data: UpdatedOrDeletedMessage });
  } catch (error) {
    console.error("[MESSAGES PATCH", error);
    res.status(500).json({ error });
  }
}
