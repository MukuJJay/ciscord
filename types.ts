import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type ModalType =
  | "createServer"
  | "invite"
  | "serverSettings"
  | "members"
  | "createChannel";

export interface ModalData {
  server?: Server;
  role?: string;
}
