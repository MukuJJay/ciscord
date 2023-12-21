import { Member, MemberRole, Profile } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Shield, ShieldCheck, ShieldPlus } from "lucide-react";

interface ServerMemberProps {
  members: (Member & { profile: Profile })[];
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldPlus className="w-4 h-4 text-rose-500" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
  [MemberRole.GUEST]: <Shield className="w-4 h-4 " />,
};

export const ServerMembers = ({ members }: ServerMemberProps) => {
  const admin = members.find((member) => member.role === MemberRole.ADMIN);
  const moderators = members.filter(
    (member) => member.role === MemberRole.MODERATOR
  );
  const guests = members.filter((member) => member.role === MemberRole.GUEST);

  return (
    <div className="w-60 h-full fixed right-0 top-0 z-10 dark:bg-[#101013] bg-zinc-200 md:hidden p-3 flex flex-col gap-8">
      {admin && (
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2 dark:text-zinc-400 font-semibold">
            <span className="text-sm">{MemberRole.ADMIN}</span>
            {roleIconMap[MemberRole.ADMIN]}
          </p>

          <div className="flex items-center gap-2 px-3">
            <Avatar className="w-7 h-7">
              <AvatarImage src={admin.profile.imageUrl} />
              <AvatarFallback>{admin.profile.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-rose-500 line-clamp-1 text-sm">
              {admin.profile.name}
            </span>
          </div>
        </div>
      )}

      {!!moderators.length && (
        <div className="flex flex-col gap-3 pb-3">
          <p className="flex items-center gap-2 dark:text-zinc-400 font-semibold">
            <span className="text-sm">{MemberRole.MODERATOR}</span>
            {roleIconMap[MemberRole.MODERATOR]}
          </p>

          {moderators.map((mod) => (
            <div key={mod.id} className="flex items-center gap-2 px-3">
              <Avatar className="w-7 h-7">
                <AvatarImage src={mod.profile.imageUrl} />
                <AvatarFallback>{mod.profile.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-emerald-500 text-sm line-clamp-1">
                {mod.profile.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {!!guests.length && (
        <div className="flex flex-col gap-3 pb-3">
          <p className="flex items-center gap-2 dark:text-zinc-400 font-semibold">
            <span className="text-sm">{MemberRole.GUEST}</span>
            {roleIconMap[MemberRole.GUEST]}
          </p>

          {guests.map((guest) => (
            <div key={guest.id} className="flex items-center gap-2 px-3">
              <Avatar className="w-7 h-7">
                <AvatarImage src={guest.profile.imageUrl} />
                <AvatarFallback>{guest.profile.name[0]}</AvatarFallback>
              </Avatar>
              <span className="line-clamp-1 text-sm dark:text-zinc-300">
                {guest.profile.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
