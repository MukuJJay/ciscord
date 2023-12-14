import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    if (!params.serverId)
      return new NextResponse("ServerId not found!", { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id,
            OR: [{ role: MemberRole.ADMIN }, { role: MemberRole.MODERATOR }],
          },
        },
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error: unknown) {
    console.error("SERVER INVITE CODE UPDATION", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
