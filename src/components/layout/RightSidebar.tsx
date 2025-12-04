"use client";

import { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Search from "../misc/Search";
import WhoToFollow from "../misc/WhoToFollow";
import CompleteProfileReminder from "../misc/CompleteProfileReminder";
import Legal from "../misc/Legal";
import { AuthContext } from "@/contexts/auth-context";

export default function RightSidebar() {
  const { token, isPending } = useContext(AuthContext);
  const pathname = usePathname();

  // Hide sidebar on a specific page, e.g., "/special-page"
  if (pathname === "/home") return null;

  return (
    <aside className="hidden xl:flex flex-col flex-shrink-0 px-4 z-50 sticky top-16 h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-6 pt-6 overflow-y-auto">
        {/* Search bar */}
        <Search />

        {/* Suggestions */}
        {token && <WhoToFollow />}
        {token && <CompleteProfileReminder token={token} />}

        {/* Login / Signup Reminder */}
        {!isPending && !token && (
          <div className="flex flex-col gap-4 p-4 rounded-lg border border-solid">
            <h2 className="text-lg font-semibold">Don’t miss what’s happening</h2>
            <p className="text-sm">People on Vicsory are the first to know.</p>
            <div className="flex gap-2 mt-2">
              <Link
                href="/"
                className="flex-1 px-4 py-2 border rounded-full text-center font-semibold transition"
              >
                Log In
              </Link>
              <Link
                href="/"
                className="flex-1 px-4 py-2 rounded-full text-center font-semibold hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* Legal / Footer */}
        <Legal />
      </div>
    </aside>
  );
}
