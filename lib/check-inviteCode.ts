import { db } from "./db";

export async function checkInviteCode(inviteCode: string, profileId: string) {
  try {
    const server = await db.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: [{ profileId }],
        },
      },
    });
    return server;
  } catch (error) {
    return false;
  }
}
