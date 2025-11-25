"use client";

import { useContext } from "react";
import Link from "next/link";

import { AuthContext } from "@/app/(vicsory)/layout";

export default function Footer() {
  const { token, isPending } = useContext(AuthContext);

  if (isPending) return null;

  if (!token) {
    return (
      <footer
        className="fixed bottom-2 z-20 w-full bg-[var(--hover)] py-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0"
        style={{ marginBottom: "5rem" }} // ensures it's above mobile bottom nav
      >
        {/* Left: Title & Description */}
        <div className="text-center md:text-left max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Don’t miss what’s happening
          </h1>
          <p className="text-muted">
            People on Vicsory are the first to know.
          </p>
        </div>

        {/* Right: Buttons */}
        <div className="flex gap-4 items-center">
          <Link
            href="/"
            className="px-6 py-2 text-white font-semibold text-center transition flex items-center"
            style={{ backgroundColor: "var(--blue)" }}
          >
            Log In
          </Link>
          <Link
            href="/"
            className="px-6 py-2 font-semibold text-center transition flex items-center"
            style={{
              color: "var(--blue)",
              border: "2px solid var(--blue)",
            }}
          >
            Sign Up
          </Link>
        </div>
      </footer>
    );
  }

  return null;
}
