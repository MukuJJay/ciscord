"use client";

import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ActionTooltip } from "@/components/action-tooltip";
import { Loader2 } from "lucide-react";
import { useContext } from "react";
import { isServerAndChannelLoading } from "@/contexts/server-channel-loading-context";

interface NavigationServerProps {
  id: string;
  name: string;
  imageUrl: string;
}

const NavigationServers = ({ id, name, imageUrl }: NavigationServerProps) => {
  const params = useParams();
  const router = useRouter();

  const loaderContext = useContext(isServerAndChannelLoading);

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip label={name} side="right" align="center">
      <button
        className="w-[50px] h-[50px] relative rounded-[24px] group "
        onClick={onClick}
        disabled={loaderContext?.isLoading?.serverId}
      >
        {loaderContext?.isLoading?.serverId === id && (
          <div className="absolute z-40 w-full h-full flex justify-center items-center top-0">
            <Loader2 className="animate-spin w-10 h-10 text-indigo-500" />
          </div>
        )}
        <div
          className={cn(
            "w-[4px] rounded-md transition-all absolute left-[-9px] top-[50%] translate-y-[-50%] bg-zinc-900 dark:bg-zinc-300 h-[4px]",
            params?.serverId === id ? "h-[30px]" : "group-hover:h-[15px] "
          )}
        ></div>
        <Image
          fill
          src={imageUrl}
          alt={name}
          className={cn(
            "object-cover",
            params?.serverId === id
              ? "rounded-[16px]"
              : "rounded-[24px] group-hover:rounded-[16px] transition-all"
          )}
        />
      </button>
    </ActionTooltip>
  );
};

export default NavigationServers;
