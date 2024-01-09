import { Member, Profile, Server } from "@prisma/client";

import { NextApiResponse } from "next";
import { Server as ServerIo } from "socket.io";
import { Server as NetServer, Socket } from "net";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export enum searchChannelOrMember {
  "member",
  "channel",
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIo;
    };
  };
};
