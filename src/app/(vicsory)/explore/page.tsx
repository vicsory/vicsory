"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { getAllPosts } from "@/utilities/fetch";
import { AuthContext } from "../layout";
import CircularLoading from "@/components/misc/CircularLoading";
import Posts from "@/components/post/Posts";
import NewPost from "@/components/post/NewPost";

// Type definitions
import { PostProps } from "@/types/PostProps";
import { UserProps } from "@/types/UserProps";

interface Post extends PostProps {
    id: string;
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



export default function ExplorePage() {
    const { token, isPending } = useContext(AuthContext) as AuthContextType;

    const { 
        data, 
        fetchNextPage, 
        isLoading, 
        hasNextPage 
    } = useInfiniteQuery<PostsResponse, Error, InfiniteData<PostsResponse>, string[], number>({
        queryKey: ["posts"],
        queryFn: async ({ pageParam }) => getAllPosts(pageParam.toString()),
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

    const postsResponse = useMemo(
        (): PostsAccumulator | undefined =>
            data?.pages.reduce((prev: PostsAccumulator, page: PostsResponse) => {
                return {
                    nextPage: page.nextPage,
                    posts: [...prev.posts, ...page.posts],
                };
            }, { posts: [] } as PostsAccumulator),
        [data]
    );

    if (isPending) return <CircularLoading />;

    return (
        <main>
            <h1 className="page-name">Explore</h1>
            {token && <NewPost token={token} />}
            {isLoading ? (
                <CircularLoading />
            ) : (
                <InfiniteScroll
                    dataLength={postsResponse ? postsResponse.posts.length : 0}
                    next={() => fetchNextPage()}
                    hasMore={!!hasNextPage}
                    loader={<CircularLoading />}
                >
                    <Posts posts={postsResponse?.posts || []} />
                </InfiniteScroll>
            )}
        </main>
    );
}