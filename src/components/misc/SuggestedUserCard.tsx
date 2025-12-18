"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import Link from "next/link";
import { UserProps } from "@/types/UserProps";
import { getRandomThreeUsers } from "@/utilities/fetch";
import User from "../user/User";

export default function SuggestedUserCard() {
    const [isOpen, setIsOpen] = useState(true);
    const [visibleUsers, setVisibleUsers] = useState<UserProps[]>([]); // State to track visible users

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["random"],
        queryFn: getRandomThreeUsers,
        enabled: isOpen,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    // Sync visibleUsers with fetched data when it loads
    useEffect(() => {
        if (data?.success && data.users) {
            setVisibleUsers(data.users as UserProps[]);
        }
    }, [data]);

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        console.log('SuggestedUserCard Data:', { data, isLoading, isError, error });
    }, [data, isLoading, isError, error]);

    if (!isOpen) return null;
    if (isLoading) return (
        <div className="p-4 text-[var(--active-mode)] text-center">
            Loading suggestions...
        </div>
    );

    return (
        <div className="bg-[var(--background-primary)] border-t border-b border-solid border-[var(--border)] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-solid border-[var(--border)]">
                <h1 className="text-xl font-semibold text-[var(--text)]">
                    Suggested for You
                </h1>
                <button
                    className="text-[var(--text)] hover:bg-[var(--background-secondary)] p-1 rounded-full transition-colors duration-150"
                    onClick={handleClose}
                    aria-label="Close suggestions"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            {visibleUsers.length > 0 ? (
                <div className="flex overflow-x-auto gap-6 px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {visibleUsers.map((user) => (
                        <div
                            key={user.username}
                            className="flex-shrink-0 w-full max-w-[280px]"
                        >
                            <User user={user} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="px-4 py-4 text-sm text-[var(--text-secondary)] text-center">
                    No suggestions available right now
                </div>
            )}

            {/* See All Link */}
            <div className="px-4 py-3 text-center">
                <Link
                    href="/explore"
                    className="text-[var(--blue)] text-base hover:underline"
                >
                    See all
                </Link>
            </div>
        </div>
    );
}