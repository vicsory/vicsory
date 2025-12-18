import { PostProps, PostsArray } from "@/types/PostProps";
import Post from "./Post";

export default function Posts({ posts }: PostsArray) {
    return (
        <>
            {posts &&
                posts.map((post: PostProps) => {
                    return <Post key={post.id} post={post} />;
                })
            }
        </>
    );
}
