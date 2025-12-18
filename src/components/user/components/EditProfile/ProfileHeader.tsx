"use client";

import { ProfileProps } from "@/types/UserProps";
import { ArrowLeft, Link, usePathname } from "./imports";
import PostArrayLength from "@/components/post/PostArrayLength";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../../../public/svg/verify-badge";

export default function ProfileHeader({ profile, isScrolled }: ProfileProps & { isScrolled: boolean }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-2 py-2 px-4">
        <Link href="/explore" className="border border-solid border-[var(--border-color)] p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <span className="font-bold text-[15px]">{profile.username}</span>
          <PostArrayLength username={profile.username} />
          <span className="flex items-center font-bold text-[15px] hover:underline">
            {profile.isPremium && (
              <span className="inline-flex items-center ml-1 text-[var(--blue)]" data-blue="Verified Blue">
                <BadgeBlue />
              </span>
            )}
            {profile.isVip && (
              <span className="inline-flex items-center ml-1 text-[var(--blue)]" data-gold="Verified Gold">
                <BadgeGold />
              </span>
            )}
            {profile.isElite && (
              <span className="inline-flex items-center ml-1 text-[var(--blue)]" data-red="Verified Red">
                <BadgeRed />
              </span>
            )}
          </span>
        </div>
      </div>

      <div className={`fixed top-0 z-10 w-full max-w-[589px] mx-auto flex items-center gap-2 px-4 py-2 bg-[var(--top-bar-bg)] shadow-md transition-all duration-300 ease-in-out ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>
        <Link href="/explore" className="border border-solid border-[var(--border-color)] p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <span className="font-bold text-[15px]">{profile.username}</span>
          <PostArrayLength username={profile.username} />
        </div>
      </div>
    </>
  );
}