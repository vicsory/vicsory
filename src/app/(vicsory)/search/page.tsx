"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { search } from "@/utilities/fetch";
import CircularLoading from "@/components/misc/CircularLoading";
import NothingToShow from "@/components/misc/NothingToShow";
import Posts from "@/components/post/Posts";
import BackToArrow from "@/components/misc/BackToArrow";

export default function SearchPage() {
    const searchParams = useSearchParams();

    const searchQuery = searchParams?.get("q");
    const encodedSearchQuery = encodeURI(searchQuery || "");

    const queryKey = ["search", encodedSearchQuery];

    const { data, isLoading, isFetched } = useQuery({
        queryKey: queryKey,
        queryFn: () => search(encodedSearchQuery),
    });

    return (
        <main className="min-h-screen bg-[var(--background-primary)] top-0">
            <div className="flex items-center p-4 text-xl text-[var(--text)] font-bold border-solid border-b border-[var(--border)]">
                <BackToArrow title="Search results" url="/explore" />
            </div>
            {isFetched && data && (!data.posts || data.posts.length === 0) && <NothingToShow />}
            {isLoading ? <CircularLoading /> : <Posts posts={data.posts} />}
        </main>
    );
}
