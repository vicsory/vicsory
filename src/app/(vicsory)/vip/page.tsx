"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAllPosts } from "@/utilities/fetch";
import { AuthContext } from "../layout";
import CircularLoading from "@/components/misc/CircularLoading";
import { PostProps } from "@/types/PostProps";
import { UserProps } from "@/types/UserProps";
import NewPostVip from "@/components/post/NewPostVip";
import Posts from "@/components/post/Posts";

interface Post extends PostProps {
    id: string;
    author: UserProps; // Updated to match schema's "author" relation
}

interface PostsResponse {
    posts: Post[];
    nextPage: number;
    lastPage: number;
}

interface AuthContextType {
    token: UserProps | null;
    isPending: boolean;
}

export default function VIPPage() {
    const { token, isPending } = useContext(AuthContext) as AuthContextType;

    const { 
        data, 
        fetchNextPage, 
        isLoading, 
        hasNextPage 
    } = useInfiniteQuery<PostsResponse, Error, InfiniteData<PostsResponse>, string[], number>({
        queryKey: ["vip-posts"],
        queryFn: async ({ pageParam }) => getAllPosts(pageParam.toString()), // Adjust if VIP-specific endpoint exists
        initialPageParam: 1,
        getNextPageParam: (lastResponse: PostsResponse) => {
            if (lastResponse.nextPage > lastResponse.lastPage) return null;
            return lastResponse.nextPage;
        },
    });

    interface PostsAccumulator {
        nextPage?: number;
        posts: Post[];
    }

    const vipPostsResponse = useMemo(() => {
        const allPosts = data?.pages.reduce((prev: PostsAccumulator, page: PostsResponse) => {
            return {
                nextPage: page.nextPage,
                posts: [...prev.posts, ...page.posts],
            };
        }, { posts: [] } as PostsAccumulator);

        // Filter for premium users' posts using isPremium from User model
        return {
            ...allPosts,
            posts: allPosts?.posts.filter(post => post.author.isPremium) || [],
        };
    }, [data]);

    if (isPending) return <CircularLoading />;

    return (
        <>
            {isLoading ? (
                <CircularLoading />
            ) : (
                <InfiniteScroll
                    dataLength={vipPostsResponse ? vipPostsResponse.posts.length : 0}
                    next={() => fetchNextPage()}
                    hasMore={!!hasNextPage}
                    loader={<CircularLoading />}
                >   
                {token && <NewPostVip token={token} />}
                    <Posts posts={vipPostsResponse?.posts || []} />
                </InfiniteScroll>
            )} 
        </>
    );
}

