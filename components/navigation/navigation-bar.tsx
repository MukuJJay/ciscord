import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import NavigationAddServer from "@/components/navigation/navigation-add-server";
import NavigationServers from "@/components/navigation/navigation-servers";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/modal-toggle";
import { UserButton } from "@clerk/nextjs";

const NavigationBar = async () => {
  const profile = await currentProfile();

  if (!profile) return null;

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="w-full dark:bg-zinc-950 bg-zinc-300 h-full flex flex-col items-center py-2">
      <NavigationAddServer />
      <Separator className="m-2 w-[50px]" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div
            key={server.id}
            className="flex flex-col justify-center items-center w-full mb-4"
          >
            <NavigationServers
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="flex flex-col gap-3 items-center justify-center">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: "w-[50px] h-[50px]" } }}
        />
      </div>
    </div>
  );
};

export default NavigationBar;
