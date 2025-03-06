import { useQuery } from "@tanstack/react-query";

import { PostOptionsProps, PostProps } from "@/types/PostProps";
import { getReplies } from "@/utilities/fetch";
import CircularLoading from "../misc/CircularLoading";
import Post from "./Post";

export default function Replies({ postId, postAuthor }: PostOptionsProps) {
    const queryKey = ["posts", postAuthor, postId, "replies"];

    const { isLoading, data } = useQuery({
        queryKey: queryKey,
        queryFn: () => getReplies(postAuthor, postId),
    });

    if (isLoading) return <CircularLoading />;

    return (
        <div>
            {data.posts &&
                data.posts.map((post: PostProps) => {
                    return <Post key={post.id} post={post} />;
                })}
        </div>
    );
}
