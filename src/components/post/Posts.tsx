"use client";

import { PostProps } from "@/types/PostProps";
import Post from "./Post";

type PostsProps = {
    posts: PostProps[];
};

export default function Posts({ posts }: PostsProps) {
    return (
        <div className="posts-container">
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}