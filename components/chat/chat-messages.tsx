"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useContext, useEffect, useRef } from "react";
import { ChatItem } from "./chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { isServerAndChannelLoading } from "@/contexts/server-channel-loading-context";

interface ChatMessagesProps {
  name: string;
  member: Member;
  type: "channel" | "conversation";
  chatId: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

type messageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

export const ChatMessages = ({
  name,
  type,
  chatId,
  apiUrl,
  paramKey,
  paramValue,
  member,
  socketUrl,
  socketQuery,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:message`;
  const updateKey = `chat:${chatId}:message:update`;

  useChatSocket({ queryKey, addKey, updateKey });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ apiUrl, paramKey, paramValue, queryKey });

  const chatdivRef = useRef<ElementRef<"div">>(null);
  const bottomdivRef = useRef<ElementRef<"div">>(null);
  const count = data?.pages[0]?.items.length ?? 0;
  useChatScroll({ chatdivRef, bottomdivRef, count });

  const contextLoader = useContext(isServerAndChannelLoading);

  useEffect(() => {
    if (status === "success") {
      contextLoader?.setIsLoading({ serverId: "", channelId: "" });
    }
  }, [status]);

  const handleLoadMore = () => {
    const chatdiv = chatdivRef?.current;

    if (!chatdiv) {
      return;
    }

    if (
      chatdiv?.scrollTop === -(chatdiv?.scrollHeight - chatdiv?.clientHeight)
    ) {
      fetchNextPage();
    }
  };

  if (status === "pending") {
    return (
      <div className="flex-1 flex justify-center items-center flex-col gap-1">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-zinc-500 font-bold">Loading messages ...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-1 flex justify-center items-center flex-col gap-1">
        <ServerCrash className="w-8 h-8 text-zinc-500" />
        <p className="text-zinc-500 font-bold">Error loading messages</p>
      </div>
    );
  }

  return (
    <div
      ref={chatdivRef}
      onScroll={handleLoadMore}
      className="flex flex-col-reverse gap-4 h-full overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-zinc-700 scrollbar-thumb-rounded-sm"
    >
      <div ref={bottomdivRef} />
      <div className="flex flex-col-reverse">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: messageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                currentMember={member}
                member={message.member}
                deleted={message.deleted}
                createdAt={message.createdAt}
                updatedAt={message.updatedAt}
                fileUrl={message.fileUrl}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      {!hasNextPage && <ChatWelcome name={name} type={type} />}
      {hasNextPage && isFetchingNextPage && (
        <div className="p-4 flex justify-center items-center">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
        </div>
      )}
      {hasNextPage && !isFetchingNextPage && (
        <Button
          variant={"ghost"}
          onClick={() => fetchNextPage()}
          className="text-zinc-500"
        >
          Load more messages
        </Button>
      )}
    </div>
  );
};
