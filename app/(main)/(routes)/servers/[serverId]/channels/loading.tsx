"use client";

import { isServerAndChannelLoading } from "@/contexts/server-channel-loading-context";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Loading() {
  const contextLoader = useContext(isServerAndChannelLoading);
  const params = useParams();

  useEffect(() => {
    contextLoader?.setIsLoading({
      serverId: "",
      channelId: params?.channelId,
    });
  }, []);

  return <></>;
}
