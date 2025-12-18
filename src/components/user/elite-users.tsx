"use client";

import { useContext } from "react";
import Link from "next/link";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { UserProps } from "@/types/UserProps";
import Follow from "./Follow";
import { BadgeRed } from "../../../public/svg/verify-badge";
import { AuthContext } from "@/contexts/auth-context";
import { getFullURL } from "@/utilities/misc/getFullURL";

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Helper to truncate by characters
function truncateText(text: string, maxLength: number) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
}

interface UserPropsWithRemove extends UserProps {
    onRemove?: (username: string) => void;
}

export default function EliteUsers({ user }: { user: UserPropsWithRemove }) {
    const { token } = useContext(AuthContext);
    const displayName = user.name || user.username;
    const truncatedName =
        displayName.length > 14 ? `${displayName.slice(0, 12)}…` : displayName;

    const truncatedUsername =
        user.username.length > 14
            ? `${user.username.slice(0, 12)}…`
            : user.username;

    const truncatedDescription = truncateText(user.description || "", 80);

    return (
        <div
            className="
        flex gap-4 w-full p-4 rounded-xl
        bg-[var(--background-primary)]
        border border-solid border-[var(--border-color)]
        hover:bg-[var(--background-secondary)]
        transition shadow-sm
      "
        >
            {/* Avatar */}
            <Link href={`/${user.username}`} onClick={(e) => e.stopPropagation()}>
                <Avatar className="w-[52px] h-[52px] flex-shrink-0">
                    <AvatarImage
                        src={user.photoUrl ? getFullURL(user.photoUrl) : "/assets/egg.jpg"}
                        alt={user.username}
                    />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
            </Link>

            {/* Right Section */}
            <div className="flex-1 flex flex-col justify-between min-w-0 cursor-pointer select-none">
                {/* Top: Name + badges + username + follow */}
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 font-medium text-[15px] overflow-hidden">
                            <span className="truncate">{truncatedName}</span>
                            {user.isElite && (
                                <BadgeRed className="inline-block w-6 h-6 shrink-0" />
                            )}
                        </div>

                        <span className="text-[15px] text-[var(--text-2)] block truncate">
                            @{truncatedUsername}
                        </span>
                    </div>

                    {/* Follow button */}
                    {token && user.username !== token.username && <Follow profile={user} />}
                </div>

                {/* Middle: Description */}
                {truncatedDescription && (
                    <p className="mt-1 text-[15px] text-[var(--text-2)] truncate">
                        {truncatedDescription}
                    </p>
                )}

                {/* Bottom: Category */}
                {user.category && user.category !== "NONE" && (
                    <span className="mt-2 inline-block text-[var(--active-mode)] text-[15px] font-medium truncate">
                        {capitalizeFirstLetter(user.category)}
                    </span>
                )}
            </div>
        </div>
    );
}
