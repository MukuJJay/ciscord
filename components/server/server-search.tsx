"use client";

import { useEffect, useState } from "react";
import { searchChannelOrMember } from "@/types";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface ServerSearchProps {
  data: {
    label: string;
    type: searchChannelOrMember;
    eachData:
      | {
          id: string;
          name: string;
          icon: React.ReactNode;
        }[]
      | undefined;
  }[];
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant={"ghost"}
        className="w-full flex items-center justify-between"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex items-center justify-center gap-1 text-zinc-400 text-sm">
          <Search className="w-4 h-4" />
          Search
        </span>
        <span className="text-zinc-400 text-xs dark:bg-zinc-900 px-2 rounded-lg bg-zinc-300">
          <kbd className="text-lg align-middle mr-1">⌘</kbd>K
        </span>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Enter a channel name or a member name" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, type, eachData }) => {
            if (!eachData?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {eachData?.map(({ id, name, icon }) => (
                  <CommandItem
                    key={id}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {icon}
                    {name}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};
