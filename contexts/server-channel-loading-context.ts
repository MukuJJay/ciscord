import { createContext, useState } from "react";

type ids = {
  serverId: any;
  channelId: any;
};

interface isServerAndChannelLoadingType {
  isLoading: ids;
  setIsLoading: (isLoading: ids) => void;
}

export const isServerAndChannelLoading =
  createContext<isServerAndChannelLoadingType | null>(null);
