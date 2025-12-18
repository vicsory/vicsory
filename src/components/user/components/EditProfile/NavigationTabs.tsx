"use client";

import { ProfileProps } from "@/types/UserProps";
import { Link, Tabs, TabsList, TabsTrigger, usePathname } from "./imports";

export default function NavigationTabs({ profile }: ProfileProps) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === `/${profile.username}/replies`) return "replies";
    if (pathname === `/${profile.username}/media`) return "media";
    if (pathname === `/${profile.username}/likes`) return "likes";
    return "posts";
  };

  return (
    <Tabs defaultValue={getActiveTab()} className="w-full mt-2">
      <TabsList className="w-full flex justify-around border-b border-solid border-[var(--border-color)] bg-transparent">
        <TabsTrigger value="posts" className="text-[15px] flex items-center justify-center text-[var(--text-secondary)] w-full font-bold py-3 relative hover:bg-[var(--hover)] transition-colors duration-100 group data-[state=active]:text-black" asChild>
          <Link href={`/${profile.username}`} className="relative z-10">
            <span>Posts</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--blue)] transition-colors duration-100"></span>
          </Link>
        </TabsTrigger>
        <TabsTrigger value="replies" className="text-[15px] flex items-center justify-center text-[var(--text-secondary)] w-full font-bold py-3 relative hover:bg-[var(--hover)] transition-colors duration-100 group data-[state=active]:text-black" asChild>
          <Link href={`/${profile.username}/replies`} className="relative z-10">
            <span>Replies</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--blue)] transition-colors duration-100"></span>
          </Link>
        </TabsTrigger>
        <TabsTrigger value="media" className="text-[15px] flex items-center justify-center text-[var(--text-secondary)] w-full font-bold py-3 relative hover:bg-[var(--hover)] transition-colors duration-100 group data-[state=active]:text-black" asChild>
          <Link href={`/${profile.username}/media`} className="relative z-10">
            <span>Media</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--blue)] transition-colors duration-100"></span>
          </Link>
        </TabsTrigger>
        <TabsTrigger value="likes" className="text-[15px] flex items-center justify-center text-[var(--text-secondary)] w-full font-bold py-3 relative hover:bg-[var(--hover)] transition-colors duration-100 group data-[state=active]:text-black" asChild>
          <Link href={`/${profile.username}/likes`} className="relative z-10">
            <span>Likes</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--blue)] transition-colors duration-100"></span>
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}