import { useRouter } from "next/navigation";

import { PostProps } from "@/types/PostProps";
import ReplyIcon from "../../../public/svg/reply";

export default function Reply({ post }: { post: PostProps }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/${post.author.username}/posts/${post.id}`);
    };

    return (
        <div className="flex items-center space-x-2 transition-colors text-[var(--text)] hover:text-[var(--text-secondary)]" onClick={handleClick}>
            <ReplyIcon/> {post.replies.length === 0 ? null : <span className="font-bold">{post.replies.length}</span>}
        </div>
    );
}
