"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

// Define interfaces
interface User {
  username: string;
  name: string;
  id: string;
  isPremium: boolean;
  photoUrl: string | null;
  description: string | null;
}

interface Post {
  text: string;
  author: User;
}

interface SearchResponse {
  success: boolean;
  posts: Post[];
  users: User[];
}

// Debounce function with proper typing
function debounce(func: (query: string) => void, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: [string]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  // Since fetchResults is stable within the component, empty deps is technically correct
  // but adding the eslint disable to satisfy the linter
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFetchResults = useCallback(
    debounce((query: string) => fetchResults(query), 500),
    []
  );

  const fetchResults = async (query: string): Promise<void> => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(recentSearches.length > 0);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data: SearchResponse = await response.json();

      if (data.success) {
        const cleanQuery = query.startsWith("@") ? query.slice(1) : query;
        const userResults = data.users
          .filter(
            (user) =>
              user.username.toLowerCase().includes(cleanQuery.toLowerCase()) ||
              user.name.toLowerCase().includes(cleanQuery.toLowerCase())
          )
          .map((user) => `@${user.username}`);
        const postResults = data.posts
          .filter((post) =>
            post.text.toLowerCase().includes(cleanQuery.toLowerCase())
          )
          .map((post) => post.text.slice(0, 50));

        const combinedResults = [...new Set([...userResults, ...postResults])];
        setResults(combinedResults.slice(0, 5));
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(recentSearches.length > 0);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setIsOpen(recentSearches.length > 0);
    }
  };

  useEffect(() => {
    debounceFetchResults(searchQuery);
  }, [searchQuery, debounceFetchResults]);

  const onSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchQuery) {
      const encodedSearchQuery = encodeURIComponent(searchQuery);
      router.push(`/search?q=${encodedSearchQuery}`);
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev].slice(0, 5));
      }
      setIsOpen(false);
    }
  };

  const handleSelect = (value: string): void => {
    setSearchQuery(value);
    setIsOpen(false);
    const encodedSearchQuery = encodeURIComponent(value);
    router.push(`/search?q=${encodedSearchQuery}`);
    if (!recentSearches.includes(value)) {
      setRecentSearches((prev) => [value, ...prev].slice(0, 5));
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={onSearch} className="relative flex items-center">
        <input
          className="w-full py-2 pl-4 pr-10 rounded-full bg-[var(--background-primary)] text-[var(--active-mode)] border border-[var(--border-color)] focus:outline-none focus:border-[var(--blue)] focus:border-2 placeholder-gray-500 hover:bg-[var(--hover)] transition-colors duration-200"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Search"
          required
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              onSearch(e as any); // Type assertion needed due to event type mismatch
            }
          }}
        />
        <button
          type="submit"
          className="absolute right-3 text-muted hover:text-[var(--blue)] transition-colors duration-200"
        >
          <BsSearch className="h-5 w-5" />
        </button>
      </form>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1">
          <Command className="rounded-lg border border-[var(--border-color)] bg-[var(--background-primary)] shadow-md">
            <CommandInput
              placeholder={searchQuery ? "Type to search..." : ""}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-none bg-transparent text-[var(--active-mode)] placeholder-muted"
            />
            <CommandList>
              <CommandEmpty className="py-2 text-center text-muted">
                No results found.
              </CommandEmpty>
              {results.length > 0 && (
                <CommandGroup heading="Suggestions" className="text-[var(--active-mode)]">
                  {results.map((result, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSelect(result)}
                      className="cursor-pointer hover:bg-[var(--hover)] text-[var(--active-mode)]"
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {recentSearches.length > 0 && (
                <>
                  {results.length > 0 && (
                    <CommandSeparator className="bg-[var(--border-color)]" />
                  )}
                  <CommandGroup heading="Recent Searches" className="text-[var(--active-mode)]">
                    {recentSearches.map((search, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => handleSelect(search)}
                        className="cursor-pointer hover:bg-[var(--hover)] text-[var(--active-mode)]"
                      >
                        {search}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}