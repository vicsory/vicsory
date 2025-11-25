"use client";

import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Posts from "@/components/post/Posts";
import { getRelatedPosts } from "@/utilities/fetch";
import CircularLoading from "@/components/misc/CircularLoading";
import NothingToShow from "@/components/misc/NothingToShow";
import NewPost from "@/components/post/NewPost";
import { AuthContext } from "../layout";
import Stories from "@/components/story/Stories";

export default function HomePage() {
    const { token, isPending } = useContext(AuthContext);

    const { isLoading, data } = useQuery({
        queryKey: ["posts", "home"],
        queryFn: () => getRelatedPosts(),
    });

    if (isPending || isLoading) return <CircularLoading />;

    return (
        <div className="w-full">
            {token && <Stories stories={[]} userId={"userId"} token={token} />}
            {token && <NewPost token={token} />}
            {data && data.posts.length === 0 && <NothingToShow />}
            <Posts posts={data.posts} />
        </div>
    );
}
