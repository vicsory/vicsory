import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AiFillTwitterCircle } from "react-icons/ai";

import { TweetProps } from "@/types/TweetProps";
import { formatDate, formatDateExtended } from "@/utilities/date";
import { shimmer } from "@/utilities/misc/shimmer";
import Reply from "./Reply";
import Retweet from "./Retweet";
import Like from "./Like";
import Share from "./Share";
import PreviewDialog from "../dialog/PreviewDialog";
import { getFullURL } from "@/utilities/misc/getFullURL";
import RetweetIcon from "../misc/RetweetIcon";
import ProfileCard from "../user/ProfileCard";
import { AuthContext } from "@/contexts/auth-context";

export default function Tweet({ tweet }: { tweet: TweetProps }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [hoveredProfile, setHoveredProfile] = useState("");
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

    const { token } = useContext(AuthContext);
    const router = useRouter();

    let displayedTweet = tweet.isRetweet ? tweet.retweetOf : tweet;

    const goToTweet = () => {
        router.push(`/${displayedTweet.author.username}/tweets/${displayedTweet.id}`);
    };

    const stop = (e: React.MouseEvent) => e.stopPropagation();

    const openPopover = (
        e: React.MouseEvent<HTMLElement>,
        username: string
    ) => {
        setHoveredProfile(username);
        setPopoverAnchor(e.currentTarget);
    };

    const closePopover = () => {
        setPopoverAnchor(null);
        setHoveredProfile("");
    };

    return (
        <motion.div
            onClick={goToTweet}
            className="relative flex gap-3 px-4 py-3 border-b cursor-pointer hover:bg-zinc-50/50 transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Avatar */}
            <Link
                href={`/${displayedTweet.author.username}`}
                onClick={stop}
                onMouseEnter={(e) => openPopover(e, displayedTweet.author.username)}
                onMouseLeave={closePopover}
                className="shrink-0"
            >
                <Image
                    src={
                        displayedTweet.author.photoUrl
                            ? getFullURL(displayedTweet.author.photoUrl)
                            : "/assets/egg.jpg"
                    }
                    width={600}
                    height={600}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-transparent hover:ring-zinc-300 transition"
                />
            </Link>

            {/* Main */}
            <div className="flex-1 min-w-0">

                {/* Header */}
                <div className="flex items-center flex-wrap gap-1 text-[15px] leading-5">
                    <Link
                        href={`/${displayedTweet.author.username}`}
                        onClick={stop}
                        onMouseEnter={(e) => openPopover(e, displayedTweet.author.username)}
                        onMouseLeave={closePopover}
                        className="flex items-center gap-1 hover:underline"
                    >
                        <span className="font-semibold truncate">
                            {displayedTweet.author.name || displayedTweet.author.username}
                        </span>
                        {displayedTweet.author.isPremium && (
                            <AiFillTwitterCircle className="w-5 h-5" />
                        )}
                    </Link>

                    <span className="truncate opacity-70">@{displayedTweet.author.username}</span>
                    <span>·</span>

                    <time
                        className="hover:underline opacity-70"
                        title={formatDateExtended(displayedTweet.createdAt)}
                    >
                        {formatDate(displayedTweet.createdAt)}
                    </time>
                </div>

                {/* Reply information */}
                {displayedTweet.isReply && (
                    <div className="mt-1 text-[15px] opacity-70">
                        Replying to{" "}
                        <Link
                            href={`/${displayedTweet.repliedTo.author.username}`}
                            onClick={stop}
                            className="hover:underline"
                            onMouseEnter={(e) =>
                                openPopover(e, displayedTweet.repliedTo.author.username)
                            }
                            onMouseLeave={closePopover}
                        >
                            @{displayedTweet.repliedTo.author.username}
                        </Link>
                    </div>
                )}

                {/* Text */}
                <p className="mt-2 text-[15px] leading-5 whitespace-pre-wrap break-words">
                    <span className="font-semibold">
                        {displayedTweet.text.split("\n")[0]}
                    </span>
                    {displayedTweet.text.includes("\n") && (
                        <>
                            {"\n"}
                            {displayedTweet.text.split("\n").slice(1).join("\n")}
                        </>
                    )}
                </p>


                {/* Media */}
                {displayedTweet.photoUrl && (
                    <div onClick={stop} className="mt-3">
                        <div className="max-w-lg overflow-hidden rounded-2xl border">
                            <Image
                                onClick={() => setIsPreviewOpen(true)}
                                src={getFullURL(displayedTweet.photoUrl)}
                                alt=""
                                width={600}
                                height={600}
                                placeholder="blur"
                                blurDataURL={shimmer(600, 600)}
                                className="w-full cursor-zoom-in hover:brightness-95 transition"
                            />
                        </div>

                        <PreviewDialog
                            open={isPreviewOpen}
                            handlePreviewClose={() => setIsPreviewOpen(false)}
                            url={displayedTweet.photoUrl}
                        />
                    </div>
                )}

                {/* Actions */}
                <div
                    onClick={stop}
                    className="flex justify-between mt-4 max-w-md text-[15px]"
                >
                    <Reply tweet={displayedTweet} />
                    <Retweet
                        tweetId={displayedTweet.id}
                        tweetAuthor={displayedTweet.author.username}
                    />
                    <Like
                        tweetId={displayedTweet.id}
                        tweetAuthor={displayedTweet.author.username}
                    />
                    <Share
                        tweetUrl={`https://${window.location.hostname}/${displayedTweet.author.username}/tweets/${displayedTweet.id}`}
                    />
                </div>
            </div>

            {/* Retweet Indicator */}
            {tweet.isRetweet && (
                <div className="absolute top-1 left-16 flex items-center gap-1.5 text-sm opacity-70">
                    <RetweetIcon />
                    {token?.username === tweet.author.username ? (
                        <Link href={`/${token?.username}`} onClick={stop} className="hover:underline">
                            You retweeted
                        </Link>
                    ) : (
                        <Link
                            href={`/${tweet.author.username}`}
                            onClick={stop}
                            onMouseEnter={(e) => openPopover(e, tweet.author.username)}
                            onMouseLeave={closePopover}
                            className="hover:underline"
                        >
                            {tweet.author.name || tweet.author.username} retweeted
                        </Link>
                    )}
                </div>
            )}

            {/* Hover Card */}
            {popoverAnchor && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        top: popoverAnchor.getBoundingClientRect().bottom + 10,
                        left:
                            popoverAnchor.getBoundingClientRect().left +
                            popoverAnchor.offsetWidth / 2,
                        transform: "translateX(-50%)",
                    }}
                    onMouseEnter={() => setPopoverAnchor(popoverAnchor)}
                    onMouseLeave={closePopover}
                >
                    <div className="pointer-events-auto">
                        <ProfileCard username={hoveredProfile} token={token} />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
