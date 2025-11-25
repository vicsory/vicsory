"use client";

import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import VicsoryTextLogo from "./vicsory-text-logo";
import Hero from "../trending/hero/hero";

export default function Search() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* DESKTOP VERSION: full search bar */}
      <div className="hidden md:block w-full max-w-md mx-auto">
        <form className="relative flex items-center">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="
              w-full py-2 pl-4 pr-10 rounded-full 
              bg-[var(--hover)] 
              text-[var(--active-mode)]
              border border-[var(--border-color)]
              focus:outline-none
              focus:border-[var(--blue)] 
              focus:border-2
              placeholder-[var(--text-2)]
              hover:bg-[var(--hover)]
              transition-colors
            "
          />
          <button
            type="submit"
            className="absolute right-3 text-[var(--active-mode)] hover:text-[var(--blue)]"
          >
            <BsSearch className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* MOBILE VERSION: Only icon */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden border border-solid bg-[var(--hover)] border-[var(--border-color)] rounded-full px-3 sm:px-5 py-2.5"
      >
        <BsSearch className="h-5 w-5 text-[var(--active-mode)]" />
      </button>

      {/* FULL SCREEN SEARCH DIALOG (mobile) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
      p-0 w-full h-screen max-w-full 
      rounded-none 
      bg-[var(--background-primary)] 
      flex flex-col
      border-none
    "
        >
          {/* GOOGLE STYLE HEADER */}
          <div className="pt-10 pb-4 flex flex-col items-center gap-4">
            <DialogTitle>
              <div className="font-bold text-5xl">
                <VicsoryTextLogo />
              </div>
            </DialogTitle>

            {/* Search input like Google mobile */}
            <div className="px-4 w-full">
              <div className="flex items-center border border-solid bg-[var(--hover)] border-[var(--border-color)] rounded-full px-3 sm:px-5 py-2.5">
                <button
                  type="submit"
                  className="absolute right-8 text-[var(--active-mode)] hover:text-[var(--blue)]"
                >
                  <BsSearch className="h-5 w-5" />
                </button>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="
              flex-1 bg-transparent outline-none text-[var(--active-mode)]
            "
                />
              </div>
            </div>
            <div className="w-full h-lvh bg-background">
              <Hero />
            </div>
          </div>

          {/* RESULT SECTION */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {/* Place your Command / results list here */}
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}
