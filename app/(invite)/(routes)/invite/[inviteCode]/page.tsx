import { checkInviteCode } from "@/lib/check-inviteCode";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  const profile = await currentProfile();
  const { inviteCode } = params;

  if (!inviteCode) return redirect("/");

  if (!profile) return redirectToSignIn();

  const existingServer = await db.server.findUnique({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const serverUpdated = await checkInviteCode(inviteCode, profile.id);

  if (serverUpdated) return redirect(`/servers/${serverUpdated.id}`);

  return null;
};

export default InvitePage;
