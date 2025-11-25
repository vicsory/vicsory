"use client";

import { useRouter } from "next/navigation";

import { PostProps } from "@/types/PostProps";
import { MessageSquare } from "lucide-react";

export default function Reply({ post }: { post: PostProps }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/${post.author.username}/posts/${post.id}`);
    };

    // Define consistent icon size matching previous components
    const iconSize = 16;

    return (
        <button 
            className="flex items-center gap-1 p-2 text-muted rounded-full transition-colors duration-200"
            onClick={handleClick}
        >
            <MessageSquare size={iconSize} />
            {post.replies.length > 0 && (
                <span className="text-sm font-medium text-muted">
                    {post.replies.length}
                </span>
            )}
        </button>
    );
}