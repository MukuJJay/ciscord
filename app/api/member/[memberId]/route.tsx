import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");
    const { memberId } = params;

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId)
      return new NextResponse("Server ID is missing!", { status: 400 });

    if (!memberId)
      return new NextResponse("Member ID is missing!", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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

    if (!server)
      return new NextResponse("Unable to update role!", { status: 400 });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[Update Member]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { memberId } = params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!memberId)
      return new NextResponse("Member ID is missing!", { status: 400 });

    if (!serverId)
      return new NextResponse("Server ID is missing!", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            OR: [{ role: MemberRole.MODERATOR }, { role: MemberRole.ADMIN }],
          },
        },
      },
      data: {
        members: {
          delete: {
            id: memberId,
            role: {
              not: MemberRole.ADMIN,
            },
          },
        },
      },
      include: {
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

    if (!server)
      return new NextResponse("Member deletion is not possible!", {
        status: 401,
      });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[Delete Member]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
