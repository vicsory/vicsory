"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { getAllTweets } from "@/utilities/fetch";
import NewTweet from "@/components/tweet/NewTweet";
import Tweets from "@/components/tweet/Tweets";
import CircularLoading from "@/components/misc/CircularLoading";
import { AuthContext } from "@/contexts/auth-context";

export default function ExplorePage() {
  const { token, isPending } = useContext(AuthContext);

  const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery(
    ["tweets"],
    async ({ pageParam = 1 }) => getAllTweets(pageParam),
    {
      getNextPageParam: (lastResponse) => {
        if (lastResponse.nextPage > lastResponse.lastPage) return false;
        return lastResponse.nextPage;
      },
    }
  );

  const tweetsResponse = useMemo(
    () =>
      data?.pages.reduce(
        (prev, page) => ({
          nextPage: page.nextPage,
          tweets: [...prev.tweets, ...page.tweets],
        }),
        { tweets: [], nextPage: 1 }
      ),
    [data]
  );

  if (isPending) return <CircularLoading />;

  return (
    <main className="flex-1 max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>

      {/* New Tweet form */}
      {token && <NewTweet token={token} />}

      {/* Tweets */}
      {isLoading ? (
        <CircularLoading />
      ) : (
        <InfiniteScroll
          dataLength={tweetsResponse?.tweets.length || 0}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<CircularLoading />}
        >
          {tweetsResponse?.tweets && <Tweets tweets={tweetsResponse.tweets} />}
        </InfiniteScroll>
      )}
    </main>
  );
}
