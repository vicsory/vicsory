"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { X } from "lucide-react";
import Image from "next/image";
import { UserProps } from "@/types/UserProps";
import { AuthContext } from "@/app/(vicsory)/layout";
import Follow from "./Follow";
import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../public/svg/verify-badge";

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

interface UserPropsWithRemove extends UserProps {
    onRemove?: (username: string) => void; // Optional onRemove prop
}

export default function User({ user, onRemove }: { user: UserPropsWithRemove; onRemove?: (username: string) => void }) {
    const { token } = useContext(AuthContext);
    const router = useRouter();

    const handleProfileClick = () => {
        router.push(`/${user.username}`);
    };

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering profile click
        if (onRemove) {
            onRemove(user.username);
        }
    };

    const displayName = user.name || user.username;
    const truncatedName = displayName.length > 12
        ? `${displayName.slice(0, 9)}...`
        : displayName;
    const truncatedUsername = user.username.length > 10
        ? `${user.username.slice(0, 7)}...`
        : user.username;

    return (
        <div className="relative flex flex-col w-full border border-solid border-[var(--border-color)] rounded-2xl overflow-hidden">
            {/* Header/Cover Image */}
            <div className="w-full h-20 relative">
                <Image
                    src={user.headerUrl ? getFullURL(user.headerUrl) : "/assets/header.jpg"}
                    alt={`${user.username}'s cover`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
                {onRemove && (
                    <button
                        className="absolute top-2 right-2 text-[var(--active-mode)] hover:bg-[var(--hover)] p-1 rounded-full transition-colors duration-150 bg-black/50"
                        onClick={handleRemoveClick}
                        aria-label={`Remove ${user.username}`}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Profile Content */}
            <div className="flex items-start gap-3 p-3">
                <Link href={`/${user.username}`} onClick={(e) => e.stopPropagation()}>
                    <Avatar className="w-[50px] h-[50px] border-2 border-solid border-[var(--background-primary)] -mt-8">
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
                                            <BadgeBlue />
                                        </span>
                                    )}
                                    {user.isVip && (
                                        <span className="inline-flex items-center ml-1 text-[var(--blue)]" data-gold="Verified Gold">
                                            <BadgeGold />
                                        </span>
                                    )}
                                    {user.isElite && (
                                        <span className="inline-flex items-center ml-1 text-[var(--blue)]" data-red="Verified Red">
                                            <BadgeRed />
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
                                {capitalizeFirstLetter(user.category)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}