"use client";

import { useContext, useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { isServerAndChannelLoading } from "@/contexts/server-channel-loading-context";

interface VideoRoomProps {
  chatId: string;
}

export const VideoRoom = ({ chatId }: VideoRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const channelLoaderContext = useContext(isServerAndChannelLoading);

  useEffect(() => {
    if (!user?.id) return;

    const name = user?.id;

    (async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
        channelLoaderContext?.setIsLoading({ serverId: "", channelId: "" });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.id, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Connecting...
        </p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={true}
      audio={true}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
