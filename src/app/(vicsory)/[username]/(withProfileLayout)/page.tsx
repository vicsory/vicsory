"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import Posts from "@/components/post/Posts";
import { getUserPosts } from "@/utilities/fetch";
import CircularLoading from "@/components/misc/CircularLoading";
import NotFound from "@/app/not-found";
import NothingToShow from "@/components/misc/NothingToShow";

export default function UserPosts() {
    const params = useParams();
    const username = Array.isArray(params.username) ? params.username[0] : params.username;

    const { isLoading, data } = useQuery({
        queryKey: ["posts", username],
        queryFn: () => getUserPosts(username as string),
        enabled: !!username,
    });

    if (!isLoading && (!data || !data.posts)) return <NotFound />;
    if (data && data.posts.length === 0) return <NothingToShow />;

    return <>{isLoading ? <CircularLoading /> : <Posts posts={data.posts} />}</>;
}
