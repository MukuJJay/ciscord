import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const BATCH_NUMBER: number = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    if (!channelId) {
      new NextResponse("Channel ID not found!", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: BATCH_NUMBER,
        skip: 1,
        cursor: {
          id: cursor as string,
        },
        where: {
          channelId: channelId as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: BATCH_NUMBER,
        where: {
          channelId: channelId as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === BATCH_NUMBER) {
      nextCursor = messages[BATCH_NUMBER - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.error("[MESSAGES GET ERROR]", error);
    new NextResponse(`Internal server error${error}`, { status: 500 });
  }
}
