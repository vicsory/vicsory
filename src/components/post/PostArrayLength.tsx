"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "@/utilities/fetch";
import { PostsArray } from "@/types/PostProps"; // Assuming this is your type file

export default function PostArrayLength({ username }: { username: string }) {
    const { isFetched, isLoading, isError, data } = useQuery<PostsArray>({
        queryKey: ["posts", username],
        queryFn: () => getUserPosts(username),
        staleTime: 5 * 60 * 1000, // Optional: Consider data stale after 5 minutes
    });

    if (isLoading) {
        return <span className="text-muted">Loading posts...</span>;
    }

    if (isError) {
        return <span className="text-muted">Error loading posts</span>;
    }

    // Only show length if data is fetched and posts exist
    const postCount = isFetched && data?.posts ? data.posts.length : 0;

    return <span className="text-muted">{postCount} Posts</span>;
}