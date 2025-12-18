"use client";

import { useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";

type LikeButtonProps = {
  initialLiked: boolean;
  initialCount: number;
};

export default function ProfileLike({
  initialLiked,
  initialCount,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const toggleLike = async () => {
    setLiked(!liked);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    // 🔗 call your API here
    // await fetch("/api/like", { method: "POST" })
  };

  return (
    <button
      onClick={toggleLike}
      className="flex items-center gap-2 py-1 px-3 rounded-full border border-solid border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors"
    >
      {liked ? (
        <AiFillLike className="text-[var(--blue)] text-[15px]" />
      ) : (
        <AiOutlineLike className="text-[15px] text-[var(--text)]" />
      )}
      <span className="text-[var(--text)] font-bold text-[15px]">{count}</span>
    </button>
  );
}
