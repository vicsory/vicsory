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
            className="flex items-center gap-1 p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"
            onClick={handleClick}
        >
            <MessageSquare size={iconSize} />
            {post.replies.length > 0 && (
                <span className="text-sm font-medium text-gray-600">
                    {post.replies.length}
                </span>
            )}
        </button>
    );
}