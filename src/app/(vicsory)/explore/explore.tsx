"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useMemo, useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAllPosts } from "@/utilities/fetch";
import { AuthContext } from "../layout";
import CircularLoading from "@/components/misc/CircularLoading";
import Posts from "@/components/post/Posts";
import { PostProps } from "@/types/PostProps";
import { UserProps } from "@/types/UserProps";
import Hero from "@/components/trending/hero/hero";
import { usePathname } from "next/navigation";
import { NoInternet } from "@/components/misc/no-internet";
import EliteUsersScroller from "@/components/trending/features/elite-feature";

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

export default function Explore() {
  const { token, isPending } = useContext(AuthContext) as AuthContextType;
  const pathname = usePathname();
  const isExplorePage = pathname.startsWith("/explore");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const {
    data,
    fetchNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery<PostsResponse, Error, InfiniteData<PostsResponse>, string[], number>({
    queryKey: ["posts", selectedCategory],
    queryFn: async ({ pageParam = 1 }) => getAllPosts(pageParam.toString(), selectedCategory),
    getNextPageParam: (lastResponse: PostsResponse) =>
      lastResponse.nextPage > lastResponse.lastPage ? null : lastResponse.nextPage,
    initialPageParam: 1,
    enabled: online,
  });

  const posts = useMemo(() => data?.pages.flatMap((p) => p.posts) ?? [], [data]);

  if (!online) return <NoInternet />;
  if (isPending || isLoading) return <CircularLoading />;

  return (
    <div className="min-h-screen w-full bg-background">
      {selectedCategory === "All" && <Hero />}
      <EliteUsersScroller users={posts.map((p) => p.author as UserProps)} />
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <div className="py-8 text-center">
            <CircularLoading />
          </div>
        }
        style={{ overflow: "visible" }}
      >
        {isExplorePage ? (
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
              {posts.map((post) => (
                <div key={post.id} className="w-full h-min px-0 xl:px-4">
                  <Posts posts={[post]} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-0 xl:px-4">
            <Posts posts={posts} />
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
