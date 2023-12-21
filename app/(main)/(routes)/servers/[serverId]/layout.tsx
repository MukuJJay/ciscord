import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return (
    <div>
      <div className="fixed w-60 h-full dark:bg-[#101013] bg-zinc-200 md:hidden">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <div className="mdm:px-60">{children}</div>
    </div>
  );
};

export default ServerLayout;
