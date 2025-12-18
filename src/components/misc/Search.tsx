"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { BsSearch } from "react-icons/bs";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // useCallback with inline function and proper typing
  const onSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const encodedSearchQuery = encodeURIComponent(searchQuery);
      router.push(`/search?q=${encodedSearchQuery}`);
    },
    [searchQuery, router]
  );

  // Properly type the input change event
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="hidden md:block w-full max-w-md mx-auto">
      <form className="relative flex items-center" onSubmit={onSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search"
          required
          className="
            w-full py-2 px-4 rounded-full
            bg-[var(--background-secondary)]
            text-[var(--text-secondary)]
            border border-[var(--border)]
            focus:outline-none
            focus:border-[var(--blue)]
            focus:border-2
            placeholder-[var(--text-secondary)]
            hover:bg-[var(--background-secondary)]
            transition-colors
          "
        />
        <button
          type="submit"
          className="absolute right-3 text-[var(--text)] hover:text-[var(--blue)]"
        >
          <BsSearch className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
