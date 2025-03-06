"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { UserProps } from "@/types/UserProps";
import { AuthContext } from "@/app/(vicsory)/layout";
import Follow from "./Follow";
import { getFullURL } from "@/utilities/misc/getFullURL";

export default function User({ user }: { user: UserProps }) {
    const { token } = useContext(AuthContext);
    const router = useRouter();

    const handleProfileClick = () => {
        router.push(`/${user.username}`);
    };

    // Truncate name (max 50 chars) and username (max 15 chars)
    const displayName = user.name !== "" ? user.name : user.username;
    const truncatedName = displayName && displayName.length > 12
        ? `${displayName.slice(0, 9)}...` 
        : displayName;
    const truncatedUsername = user.username.length > 10
        ? `${user.username.slice(0, 7)}...` 
        : user.username;

    return (
        <div className="flex items-start gap-3">
            <Link href={`/${user.username}`}>
                <Avatar className="w-[50px] h-[50px] border-2 border-solid border-[var(--border-color)]">
                    <AvatarImage
                        src={user.photoUrl ? getFullURL(user.photoUrl) : "/assets/egg.jpg"}
                        alt={user.username}
                    />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
            </Link>
            <div onClick={handleProfileClick} className="flex-1 cursor-pointer">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="flex items-center font-bold text-[15px] hover:underline">
                                {truncatedName}
                                {user.isPremium && (
                                    <span className="inline-flex items-center ml-1 text-[var(--blue)]" data-blue="Verified Blue">
                                        <BadgeCheck className="w-4 h-4" fill="#1E90FE" stroke="#fff"/>
                                    </span>
                                )}
                            </span>
                            <span className="text-muted text-sm">@{truncatedUsername}</span>
                        </div>
                        {token && user.username !== token.username && (
                            <div className="ml-2">
                                <Follow profile={user} />
                            </div>
                        )}
                    </div>
                    {user.category && user.category !== "NONE" && (
                        <span className="flex w-fit items-center bg-[var(--grey)] rounded-3xl px-2 py-1 text-sm text-muted mt-1 border border-solid border-[var(--border-color)]"> 
                            {user.category.toLowerCase()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}