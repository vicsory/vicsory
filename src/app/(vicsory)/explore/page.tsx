"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { getAllPosts } from "@/utilities/fetch";
import NewPost from "@/components/post/NewPost";
import Posts from "@/components/post/Posts";
import CircularLoading from "@/components/misc/CircularLoading";
import { AuthContext } from "@/contexts/auth-context";
import { Categories } from "@/components/trending/category/categories";
import Hero from "@/components/trending/hero/hero";
import Topbar from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFullURL } from "@/utilities/misc/getFullURL";

export default function ExplorePage() {
  const { token, isPending } = useContext(AuthContext);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);


  const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery(
    ["posts"],
    async ({ pageParam = 1 }) => getAllPosts(pageParam),
    {
      getNextPageParam: (lastResponse) => {
        if (lastResponse.nextPage > lastResponse.lastPage) return false;
        return lastResponse.nextPage;
      },
    }
  );

  const postsResponse = useMemo(
    () =>
      data?.pages.reduce(
        (prev, page) => ({
          nextPage: page.nextPage,
          posts: [...prev.posts, ...page.posts],
        }),
        { posts: [], nextPage: 1 }
      ),
    [data]
  );

  if (isPending) return <CircularLoading />;

  return (
    <main className="flex py-4 top-14 flex-col w-full bg-[var(--background-secondary)]">

      <header className="fixed top-0 left-0 right-0 z-50">
        <Topbar />
      </header>
      <Categories />
      
      <Hero />

      {token && <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen} >
        <DialogTrigger asChild>
          <Button
            className="flex mb-2 items-center gap-2 text-lg w-full text-center text-[var(--text)] hover:text-[var(--text-secondary)] py-10 px-4 border-y border-solid border-[var(--border)] bg-[var(--background-primary)] transition-colors duration-200"
          >
            <Link href={`/${token.username}`} className="flex items-center">
              <Avatar className="w-10 h-10 border-[var(--border)] border-solid border-2 rounded-full">
                <AvatarImage
                  src={
                    token.photoUrl
                      ? getFullURL(token.photoUrl)
                      : "/assets/egg.jpg"
                  }
                  alt=""
                />
                <AvatarFallback>
                  {token.username?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <span className="border-[var(--border)] border-solid border rounded-full px-4 py-2 text-[var(--text-secondary)] font-bold bg-[var(--background-secondary)]">Post your latest update…</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full bg-[var(--background-primary)]/70 backdrop-blur-md rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Post</DialogTitle>
          </DialogHeader>
          <NewPost
            token={token}
            handleSubmit={() => {
              setIsNewPostOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>}

      {isLoading ? (
        <CircularLoading />
      ) : (
        <InfiniteScroll
          dataLength={postsResponse?.posts.length || 0}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<CircularLoading />}
        >
          {postsResponse?.posts && <Posts posts={postsResponse.posts} />}
        </InfiniteScroll>
      )}
    </main>
  );
}
