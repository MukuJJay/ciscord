"use client";

import { useContext, useState } from "react";
import { isServerAndChannelLoading } from "@/contexts/server-channel-loading-context";

export const ServerChannelLoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<any>("");

  return (
    <isServerAndChannelLoading.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </isServerAndChannelLoading.Provider>
  );
};
