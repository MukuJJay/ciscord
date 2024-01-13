"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import { ChatItem } from "./chat-item";

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ apiUrl, paramKey, paramValue, queryKey });

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
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome name={name} type={type} />
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
  );
};
