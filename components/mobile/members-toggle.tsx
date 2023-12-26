import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UsersRound } from "lucide-react";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ServerMembers } from "@/components/server/server-members";

export const MembersToggle = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!serverId) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
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

  return (
    <div>
      <Sheet>
        <SheetTrigger className="flex items-center" asChild>
          <Button variant={"outline"} size={"icon"}>
            <UsersRound className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"right"} className="p-0 flex gap-0">
          {!!server?.members && <ServerMembers members={server?.members} />}
        </SheetContent>
      </Sheet>
    </div>
  );
};
