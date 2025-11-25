"use client";

import { useRef, useEffect, useMemo } from "react";
import { PostProps } from "@/types/PostProps";
import Post from "./Post";
import SuggestedUserCard from "../misc/SuggestedUserCard";

type PostsProps = {
  posts: PostProps[];
};

export default function Posts({ posts }: PostsProps) {
  const suggestionIndexRef = useRef<number | null>(null);

  // Stable random index
  const getSuggestionIndex = (length: number) => {
    if (suggestionIndexRef.current === null) {
      suggestionIndexRef.current = Math.floor(Math.random() * (length - 1));
    }
    return suggestionIndexRef.current;
  };

  useEffect(() => {
    if (
      suggestionIndexRef.current !== null &&
      suggestionIndexRef.current >= posts.length - 1
    ) {
      suggestionIndexRef.current = null;
    }
  }, [posts.length]);

  const suggestionIndex =
    posts.length > 1 ? getSuggestionIndex(posts.length) : -1;

  const renderedItems = useMemo(() => {
    const elements: React.ReactNode[] = [];

    posts.forEach((post, index) => {
      elements.push(<Post key={post.id} post={post} />);

      if (index === suggestionIndex && posts.length > 1) {
        elements.push(
          <div key={`suggested-${index}`} className="w-full h-full">
            <SuggestedUserCard />
          </div>
        );
      }
    });

    return elements;
  }, [posts, suggestionIndex]);

  return (
    <div className="flex flex-col w-full h-full gap-4 space-y-0">
      {renderedItems}
    </div>
  );
}
