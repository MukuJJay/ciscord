import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/navigation/navigation-bar";
import { ServerSidebar } from "@/components/server/server-sidebar";

export const NavServerSidebarToggle = ({ serverId }: { serverId: string }) => {
  return (
    <div>
      <Sheet>
        <SheetTrigger className="flex items-center">
          <Button variant={"ghost"} size={"icon"}>
            <Menu className="w-7 h-7" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 flex gap-0">
          <nav className="w-[75px] h-full">
            <NavigationBar />
          </nav>
          <div className="w-60 h-full dark:bg-[#101013] bg-zinc-200 ">
            <ServerSidebar serverId={serverId} isMobile={true} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
