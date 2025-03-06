"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { search } from "@/utilities/fetch";
import CircularLoading from "@/components/misc/CircularLoading";
import NothingToShow from "@/components/misc/NothingToShow";
import Posts from "@/components/post/Posts";
import BackToArrow from "@/components/misc/BackToArrow";
import UsersSearch from "@/components/user/UsersSearch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Search from "@/components/misc/Search";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams?.get("q");
    const encodedSearchQuery = encodeURI(searchQuery || "");
    
    const queryKey = ["search", encodedSearchQuery];
    const { data, isLoading, isFetched } = useQuery({
        queryKey: queryKey,
        queryFn: () => search(encodedSearchQuery),
    });

    const [filter, setFilter] = useState("all");
    
    const hasPosts = data?.posts && data.posts.length > 0;
    const hasUsers = data?.users && data.users.length > 0;

    return (
        <main>
            <BackToArrow title="Search results" url="/explore" />
            
            <ToggleGroup type="single" value={filter} onValueChange={setFilter} className="mb-4 flex gap-2 border-b border-[var(--border-color)]">
                <ToggleGroupItem value="all" className="relative text-[14px] md:text-[15px] flex items-center justify-center text-muted font-bold py-2 px-4 group hover:bg-[var(--hover)] transition-colors duration-100 data-[state=on]:text-[var(--active-mode)]">
                    <span className="relative z-10">All</span>
                    <span className="absolute bottom-0 left-0 w-full h-[4px] bg-transparent group-data-[state=on]:bg-[var(--blue)] transition-colors duration-100"></span>
                </ToggleGroupItem>
                <ToggleGroupItem value="posts" className="relative text-[14px] md:text-[15px] flex items-center justify-center text-muted font-bold py-2 px-4 group hover:bg-[var(--hover)] transition-colors duration-100 data-[state=on]:text-[var(--active-mode)]">
                    <span className="relative z-10">Posts</span>
                    <span className="absolute bottom-0 left-0 w-full h-[4px] bg-transparent group-data-[state=on]:bg-[var(--blue)] transition-colors duration-100"></span>
                </ToggleGroupItem>
                <ToggleGroupItem value="users" className="relative text-[14px] md:text-[15px] flex items-center justify-center text-muted font-bold py-2 px-4 group hover:bg-[var(--hover)] transition-colors duration-100 data-[state=on]:text-[var(--active-mode)]">
                    <span className="relative z-10">People</span>
                    <span className="absolute bottom-0 left-0 w-full h-[4px] bg-transparent group-data-[state=on]:bg-[var(--blue)] transition-colors duration-100"></span>
                </ToggleGroupItem>
            </ToggleGroup>
            
            <Search/>
            
            {isFetched && !hasPosts && !hasUsers && <NothingToShow />}
            {isLoading ? (
                <CircularLoading />
            ) : (
                <>
                    {(filter === "all" || filter === "posts") && hasPosts && <Posts posts={data.posts} />}
                    {(filter === "all" || filter === "users") && hasUsers && <UsersSearch users={data.users} />}
                </>
            )}
        </main>
    );
}
