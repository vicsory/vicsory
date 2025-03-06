"use client";

import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/app/(vicsory)/layout";
import Search from "../misc/Search";
import WhoToFollow from "../misc/WhoToFollow";
import CompleteProfileReminder from "../misc/CompleteProfileReminder";
import Legal from "../misc/Legal";

export default function RightSidebar() {
    const { token, isPending } = useContext(AuthContext) || {};

    return (
        <aside className="w-72 sticky top-0 h-screen">
            <div className="px-4 py-2 space-y-4">
                {/* Search Component */}
                <Search />

                {/* Authenticated User Content */}
                {token && (
                    <>
                        <WhoToFollow />
                        <CompleteProfileReminder token={token} />
                    </>
                )}

                {/* Unauthenticated User Content */}
                {!isPending && !token && (
                    <div className="bg-[var(--background-primary)] shadow-md p-4 rounded-3xl border border-solid border-[var(--border-color)]">
                        <h1 className="text-lg font-bold text-[var(--active-mode)] mb-2">
                            Don’t miss what’s happening
                        </h1>
                        <p className="text-[var(--muted-text)] text-sm mb-4">
                            People on Vicsory are the first to know.
                        </p>
                        <div className="flex space-x-2">
                            <Link
                                href="/login" // Update to the correct login route
                                className="flex-1 text-center py-2 px-4 border-solid border border-[var(--border-color)] rounded-full text-[var(--active-mode)] hover:bg-[var(--hover)] transition-colors duration-200"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup" // Update to the correct signup route
                                className="flex-1 text-center py-2 px-4 border-solid border border-[var(--border-color)] rounded-full text-[var(--active-mode)] hover:bg-[var(--hover)] transition-colors duration-200"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}

                {/* Legal Component */}
                <Legal/>
            </div>
        </aside>
    );
}