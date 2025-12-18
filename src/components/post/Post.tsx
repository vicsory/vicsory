import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AiFillTwitterCircle } from "react-icons/ai";

import { PostProps } from "@/types/PostProps";
import { formatDate, formatDateExtended } from "@/utilities/date";
import { shimmer } from "@/utilities/misc/shimmer";
import Reply from "./Reply";
import Repost from "./Repost";
import Like from "./Like";
import PreviewDialog from "../dialog/PreviewDialog";
import { getFullURL } from "@/utilities/misc/getFullURL";
import ProfileCard from "../user/ProfileCard";
import { AuthContext } from "@/contexts/auth-context";
import RepostIcon from "../../../public/svg/repost";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../public/svg/verify-badge";

export default function Post({ post }: { post: PostProps }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [hoveredProfile, setHoveredProfile] = useState("");
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

    const { token } = useContext(AuthContext);
    const router = useRouter();

    let displayedPost = post.isRepost ? post.repostOf : post;

    const goToPost = () => {
        router.push(`/${displayedPost.author.username}/posts/${displayedPost.id}`);
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
            onClick={goToPost}
            className="relative flex gap-3 mb-2 px-4 py-6 border-y border-solid border-[var(--border)] cursor-pointer bg-[var(--background-primary)] hover:bg-[var(--background-secondary)] transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Avatar */}
            <Link
                href={`/${displayedPost.author.username}`}
                onClick={stop}
                onMouseEnter={(e) => openPopover(e, displayedPost.author.username)}
                onMouseLeave={closePopover}
                className="shrink-0"
            >
                <Image
                    src={
                        displayedPost.author.photoUrl
                            ? getFullURL(displayedPost.author.photoUrl)
                            : "/assets/egg.jpg"
                    }
                    width={600}
                    height={600}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-transparent hover:bg-[var(--background-secondary)] transition"
                />
            </Link>

            {/* Main */}
            <div className="flex-1 min-w-0">

                {/* Header */}
                <div className="flex items-center flex-wrap gap-1 text-[15px] leading-5">
                    <Link
                        href={`/${displayedPost.author.username}`}
                        onClick={stop}
                        onMouseEnter={(e) => openPopover(e, displayedPost.author.username)}
                        onMouseLeave={closePopover}
                        className="flex items-center gap-1 hover:underline"
                    >
                        <span className="font-semibold truncate text-[var(--text)]">
                            {displayedPost.author.name || displayedPost.author.username}
                        </span>

                        {displayedPost.author.isPremium && <BadgeBlue className="w-6 h-6" />}
                        {displayedPost.author.isVip && <BadgeGold className="w-6 h-6" />}
                        {displayedPost.author.isElite && <BadgeRed className="w-6 h-6" />}
                    </Link>

                    <span className="truncate text-[var(--text-secondary)]">@{displayedPost.author.username}</span>
                    <span className="text-[var(--text)]">·</span>
                    {displayedPost.author.category && (
                        <span className="font-medium text-[var(--text)] text-[15px]">
                            {displayedPost.author.category}
                        </span>
                    )}
                    <span className="text-[var(--text)]">·</span>

                    <time
                        className="hover:underline text-[var(--text-secondary)]"
                        title={formatDateExtended(displayedPost.createdAt)}
                    >
                        {formatDate(displayedPost.createdAt)}
                    </time>
                </div>

                {/* Reply information */}
                {displayedPost.isReply && (
                    <div className="mt-1 text-[15px] text-[var(--text-secondary)]">
                        Replying to{" "}
                        <Link
                            href={`/${displayedPost.repliedTo.author.username}`}
                            onClick={stop}
                            className="hover:underline"
                            onMouseEnter={(e) =>
                                openPopover(e, displayedPost.repliedTo.author.username)
                            }
                            onMouseLeave={closePopover}
                        >
                            @{displayedPost.repliedTo.author.username}
                        </Link>
                    </div>
                )}

                {/* Text */}
                <p className="mt-2 text-[15px] text-[var(--text)] leading-5 whitespace-pre-wrap break-words">
                    <span className="font-semibold">
                        {displayedPost.text.split("\n")[0]}
                    </span>
                    {displayedPost.text.includes("\n") && (
                        <>
                            {"\n"}
                            {displayedPost.text.split("\n").slice(1).join("\n")}
                        </>
                    )}
                </p>


                {/* Media */}
                {displayedPost.photoUrl && (
                    <div onClick={stop} className="mt-3">
                        <div className="max-w-lg overflow-hidden rounded-2xl border">
                            <Image
                                onClick={() => setIsPreviewOpen(true)}
                                src={getFullURL(displayedPost.photoUrl)}
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
                            url={displayedPost.photoUrl}
                        />
                    </div>
                )}

                {/* Actions */}
                <div
                    onClick={stop}
                    className="flex items-center justify-between mt-4 max-w-md"
                >
                    <div className="flex space-x-12">
                        <Like
                            postId={displayedPost.id}
                            postAuthor={displayedPost.author.username}
                        />
                        <Reply post={displayedPost} />
                        <Repost
                            postId={displayedPost.id}
                            postAuthor={displayedPost.author.username}
                        />
                    </div>
                </div>
            </div>

            {/* Repost Indicator */}
            {post.isRepost && (
                <div className="absolute top-[1px] left-16 flex items-center gap-1.5 text-sm opacity-70">
                    <RepostIcon className="text-[var(--text-secondary)] w-4 h-4" />
                    {token?.username === post.author.username ? (
                        <Link href={`/${token?.username}`} onClick={stop} className="hover:underline text-[var(--text-secondary)]">
                            You reposted
                        </Link>
                    ) : (
                        <Link
                            href={`/${post.author.username}`}
                            onClick={stop}
                            onMouseEnter={(e) => openPopover(e, post.author.username)}
                            onMouseLeave={closePopover}
                            className="hover:underline text-[var(--text-secondary)]"
                        >
                            {post.author.name || post.author.username} reposted
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
