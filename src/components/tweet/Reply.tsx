import { useRouter } from "next/navigation";

import { TweetProps } from "@/types/TweetProps";
import ReplyIcon from "../../../public/svg/reply";

export default function Reply({ tweet }: { tweet: TweetProps }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/${tweet.author.username}/tweets/${tweet.id}`);
    };

    return (
        <div className="flex items-center space-x-2 transition-colors text-[var(--text)] hover:text-[var(--text-secondary)]" onClick={handleClick}>
            <ReplyIcon/> {tweet.replies.length === 0 ? null : <span className="font-bold">{tweet.replies.length}</span>}
        </div>
    );
}
