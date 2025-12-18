"use client";

import { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";


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
        <Search />
        {token && <WhoToFollow />}
        {token && <CompleteProfileReminder token={token} />}
        {!isPending && !token && (
          <div className="flex flex-col gap-4 p-4 rounded-2xl border border-solid border-[var(--border)]">
            <div className="flex gap-4">
              <Image
                src="/assets/jean-kael-augustin.png"
                alt="Jean Kael Augustin"
                width={60}
                height={60}
                className="w-12 h-12 flex items-center justify-center bg-[var(--background-secondary)] rounded-full border border-solid border-[var(--border)]"
              />
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold text-[var(--text)]">Welcome to Vicsory</h2>
                <p className="text-base font-medium text-[var(--text-secondary)]">
                  I am Jean Kael Augustin, CEO of Vicsory. I am excited to welcome you to the platform.
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Link
                href="/"
                className="text-base bg-[var(--background-secondary)] text-[var(--text)] flex-1 px-4 py-2 rounded-full text-center font-semibold hover:opacity-70 transition border border-solid border-[var(--border)]"
              >
                Learn More
              </Link>

              <Link
                href="https://www.linkedin.com/in/jean-kael-augustin-7aa1182b8/"
                target="_blank"
                className="text-base bg-[var(--background-secondary)] text-[var(--text)] flex-1 px-4 py-2 rounded-full text-center font-semibold hover:opacity-70 transition border border-solid border-[var(--border)]"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
        <Legal />
      </div>
    </aside>
  );
}
