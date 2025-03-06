"use client";

import { useQuery } from "@tanstack/react-query";

import Posts from "@/components/post/Posts";
import { getUserLikes } from "@/utilities/fetch";
import CircularLoading from "@/components/misc/CircularLoading";
import NotFound from "@/app/not-found";
import NothingToShow from "@/components/misc/NothingToShow";

export default function LikesPage({ params: { username } }: { params: { username: string } }) {
    const { isLoading, data } = useQuery({
        queryKey: ["posts", username, "likes"],
        queryFn: () => getUserLikes(username),
    });

    if (!isLoading && !data.posts) return NotFound();

    if (data && data.posts.length === 0) return NothingToShow();

    return <>{isLoading ? <CircularLoading /> : <Posts posts={data.posts} />}</>;
}
