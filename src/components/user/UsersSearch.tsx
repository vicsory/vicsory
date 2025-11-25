"use client";

import { Avatar, Popover } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { UserProps } from "@/types/UserProps";
import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
import ProfileCard from "../user/ProfileCard";
import { AuthContext } from "@/app/(vicsory)/layout";
import { Badge } from "../ui/badge";
import Follow from "./Follow";
import { BadgeCheck } from "lucide-react";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../public/svg/verify-badge";

export default function Users({ users }: { users: UserProps[] }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoveredProfile, setHoveredProfile] = useState("");
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const handleUserClick = (username: string) => router.push(`/${username}`);
  const handlePropagation = (e: React.MouseEvent) => e.stopPropagation();
  const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>, username: string) => {
    setHoveredProfile(username);
    setAnchorEl(e.currentTarget);
  };
  const handlePopoverClose = () => setAnchorEl(null);

  const formatCategory = (category: string) =>
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  return (
    <section className="w-full">
      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-8 text-lg">
          No users found.
        </div>
      ) : (
        users.map((user) => (
          <motion.div
            key={user.username}
            onClick={() => handleUserClick(user.username)}
            className="flex items-center px-4 py-3 border-b border-[var(--border-color)] border-solid hover:bg-[var(--hover)] cursor-pointer transition-colors duration-200 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              onClick={handlePropagation}
              href={`/${user.username}`}
              className="mr-4 flex-shrink-0"
              onMouseEnter={(e) => handlePopoverOpen(e, user.username)}
              onMouseLeave={handlePopoverClose}
            >
              <Avatar
                className="transition-transform group-hover:scale-105"
                sx={{ width: 50, height: 50 }}
                alt={`${user.name || user.username}'s avatar`}
                src={user.photoUrl ? getFullURL(user.photoUrl) : "/assets/egg.jpg"}
              />
            </Link>
            <div className="flex-1 min-w-0 flex items-center justify-between">
              <Link
                onClick={handlePropagation}
                href={`/${user.username}`}
                className="no-underline text-inherit"
                onMouseEnter={(e) => handlePopoverOpen(e, user.username)}
                onMouseLeave={handlePopoverClose}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-lg hover:underline">
                      {user.name || user.username}
                    </span>
                    {user.isPremium && (
                      <BadgeBlue/>
                    )}
                    {user.isVip && (
                      <BadgeGold/>
                    )}
                    {user.isElite && (
                      <BadgeRed/>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted text-sm">@{user.username}</span>
                    {user.category && user.category !== "NONE" && (
                      <Badge
                        className="rounded-full border border-solid hover:border-[var(--border-color)] ml-2 bg-[var(--hover)] text-muted hover:bg-transparent hover:text-muted text-[14px] md:text-[15px] font-normal"
                      >
                        {formatCategory(user.category)}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
              {token && user.username !== token.username && (
                <div className="ml-4">
                  <Follow profile={user} />
                </div>
              )}
            </div>
            <Popover
              sx={{ pointerEvents: "none" }}
              open={Boolean(anchorEl) && hoveredProfile === user.username}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              transformOrigin={{ vertical: "bottom", horizontal: "center" }}
              onClose={handlePopoverClose}
              disableRestoreFocus
              classes={{
                paper: "shadow-lg rounded-lg mt-2 bg-white border border-gray-100",
              }}
            >
              <ProfileCard username={user.username} token={token} />
            </Popover>
          </motion.div>
        ))
      )}
    </section>
  );
}