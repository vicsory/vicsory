import { useQuery } from "@tanstack/react-query";

import { getUserPosts } from "@/utilities/fetch";

export default function PostArrayLength({ username }: { username: string }) {
    const { isFetched, data } = useQuery({
        queryKey: ["posts", username],
        queryFn: () => getUserPosts(username),
    });

    return <span className="text-[var(--text-secondary)]">{isFetched ? data.posts?.length : "0"} Posts</span>;
}
