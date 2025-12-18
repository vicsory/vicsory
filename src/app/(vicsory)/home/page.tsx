"use client";

import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import Posts from "@/components/post/Posts";
import { getRelatedPosts } from "@/utilities/fetch";
import CircularLoading from "@/components/misc/CircularLoading";
import NothingToShow from "@/components/misc/NothingToShow";
import NewPost from "@/components/post/NewPost";
import { AuthContext } from "@/contexts/auth-context";

export default function HomePage() {
    const { token, isPending } = useContext(AuthContext);

    const { isLoading, data } = useQuery({
        queryKey: ["posts", "home"],
        queryFn: () => getRelatedPosts(),
    });

    if (isPending || isLoading) return <CircularLoading />;

    return (
        <main>
            <h1 className="text-[var(--text)] text-2xl font-bold p-4">Home</h1>
            {token && <NewPost token={token} />}
            {data && data.posts.length === 0 && <NothingToShow />}
            <Posts posts={data.posts} />
        </main>
    );
}
