import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initiateProfile } from "@/lib/initiate-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initiateProfile();

  if (!profile) return redirectToSignIn();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
