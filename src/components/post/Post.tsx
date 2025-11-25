"use client";

import { Avatar, Popover, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PostProps } from "@/types/PostProps";
import { formatDate, formatDateExtended } from "@/utilities/date";
import Reply from "./Reply";
import Repost from "./Repost";
import Like from "./Like";
import Share from "./Share";
import { AuthContext } from "@/app/(vicsory)/layout";
import ProfileCard from "../user/ProfileCard";
import { Repeat2, Lock } from "lucide-react";
import Follow from "../user/Follow";
import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
import { shimmer } from "@/utilities/fetch/misc/shimmer";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../public/svg/verify-badge";
import PreviewDialog from "../dialog/PreviewDialog";
import NotFound from "@/app/not-found";

export default function Post({ post }: { post: PostProps }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredProfile, setHoveredProfile] = useState("");

    const { token } = useContext(AuthContext);
    const router = useRouter();

    // Determine which post to display
    const displayedPost: PostProps | null = post.isRepost && post.repostOf ? post.repostOf : post;
    if (!displayedPost || !displayedPost.author) return <NotFound />;



    // If the post or author doesn't exist, show NotFound
    if (!displayedPost || !displayedPost.author) {
        return <NotFound />;
    }

    const handlePostClick = () => {
        if (displayedPost.author?.username) {
            router.push(`/${displayedPost.author.username}/posts/${displayedPost.id}`);
        }
    };

    const handlePropagation = (e: React.MouseEvent) => e.stopPropagation();
    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPreviewOpen(true);
    };

    const handlePopoverOpen = (
        e: React.MouseEvent<HTMLElement>,
        type: "default" | "mention" | "repost" = "default"
    ) => {
        if (type === "mention" && displayedPost.repliedTo?.author) {
            setHoveredProfile(displayedPost.repliedTo.author.username);
        } else if (type === "repost") {
            setHoveredProfile(post.author?.username || "");
        } else {
            setHoveredProfile(displayedPost.author.username);
        }
        setAnchorEl(e.currentTarget);
    };

    const handlePopoverClose = () => setAnchorEl(null);

    const baseClasses = "flex px-4 py-3 border-solid border-b border-[var(--border-color)] cursor-pointer transition-all duration-150";
    const premiumBg = "hover:bg-[var(--hover)] text-[var(--text-2)]";
    const vipBg = "hover:bg-[var(--hover)] text-[var(--text-2)]";
    const eliteBg = "hover:bg-[var(--hover)] text-[var(--text-2)]";
    const normalBg = "hover:bg-[var(--hover)] text-[var(--text-2)]";
    const premiumAvatarBorder = "inline-block rounded-full p-[2px] bg-[linear-gradient(to_right,#FFD700,#DAA520,#B8860B)]";

    const isViewerPremium = token?.isPremium || false;
    const isViewerVip = token?.isVip || false;
    const isViewerElite = token?.isElite || false;

    const isOwnPost = token && displayedPost.author.username === token.username;
    const canViewContent =
        isOwnPost ||
        (displayedPost.author.isPremium ? isViewerPremium : true) &&
        (displayedPost.author.isVip ? isViewerVip : true) &&
        (displayedPost.author.isElite ? isViewerElite : true);

    return (
        <motion.div
            onClick={handlePostClick}
            className={`
                ${baseClasses} 
                ${displayedPost.author.isElite
                    ? eliteBg
                    : displayedPost.author.isVip
                        ? vipBg
                        : displayedPost.author.isPremium
                            ? premiumBg
                            : normalBg
                }
            `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Avatar */}
            <div className="flex-shrink-0 mr-3">
                <Link
                    onClick={handlePropagation}
                    href={`/${displayedPost.author.username}`}
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                >
                    {displayedPost.author.isPremium ? (
                        <div className={premiumAvatarBorder}>
                            <Avatar
                                sx={{ width: 48, height: 48 }}
                                alt=""
                                src={displayedPost.author.photoUrl ? getFullURL(displayedPost.author.photoUrl) : "/assets/egg.jpg"}
                                className="hover:opacity-90 transition-opacity rounded-full bg-[var(--background-primary)]"
                            />
                        </div>
                    ) : (
                        <Avatar
                            sx={{ width: 48, height: 48 }}
                            alt=""
                            src={displayedPost.author.photoUrl ? getFullURL(displayedPost.author.photoUrl) : "/assets/egg.jpg"}
                            className="hover:opacity-90 transition-opacity bg-[var(--background-primary)]"
                        />
                    )}
                </Link>
            </div>

            {/* Post content */}
            <div className="flex-1 min-w-0">
                {/* Repost info */}
                {post.isRepost && post.author && (
                    <div className="flex items-center text-sm mb-1 text-[var(--text-2)]">
                        <Repeat2 className="w-4 h-4 mr-2 text-[var(--text-2)]" />
                        {token?.username === post.author.username ? (
                            <span>You Reposted</span>
                        ) : (
                            <Link
                                onClick={handlePropagation}
                                href={`/${post.author.username}`}
                                className="hover:underline"
                                onMouseEnter={(e) => handlePopoverOpen(e, "repost")}
                                onMouseLeave={handlePopoverClose}
                            >
                                {`${post.author.name || post.author.username} Reposted`}
                            </Link>
                        )}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-1 flex-wrap">
                        <Link
                            onClick={handlePropagation}
                            href={`/${displayedPost.author.username}`}
                            className="flex items-center gap-1"
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                        >
                            <span className="font-bold text-[var(--active-mode)] text-[15px] hover:underline">
                                {displayedPost.author.name || displayedPost.author.username}
                            </span>

                            {displayedPost.author.isPremium && <BadgeBlue className="w-6 h-6" />}
                            {displayedPost.author.isVip && <BadgeGold className="w-6 h-6" />}
                            {displayedPost.author.isElite && <BadgeRed className="w-6 h-6" />}

                            <span className="text-[15px] text-[var(--text-2)]">
                                @{displayedPost.author.username}
                            </span>

                            {displayedPost.author.category && (
                                <span className="font-medium text-[var(--active-mode)] text-[15px]">
                                    {displayedPost.author.category}
                                </span>
                            )}
                        </Link>

                        <Tooltip title={formatDateExtended(displayedPost.createdAt)} placement="top">
                            <span className="text-[15px] text-[var(--text-2)]">
                                · {formatDate(displayedPost.createdAt)}
                            </span>
                        </Tooltip>
                    </div>

                    {token && displayedPost.author.username !== token.username && (
                        <Follow profile={displayedPost.author} />
                    )}
                </div>

                {/* Text */}
                <div className="mt-1 text-[15px] leading-5 relative">
                    {displayedPost.isReply && displayedPost.repliedTo?.author && (
                        <span>
                            Replying to{" "}
                            <Link
                                onClick={handlePropagation}
                                href={`/${displayedPost.repliedTo.author.username}`}
                                className="text-[var(--text-2)] hover:underline"
                                onMouseEnter={(e) => handlePopoverOpen(e, "mention")}
                                onMouseLeave={handlePopoverClose}
                            >
                                @{displayedPost.repliedTo.author.username}
                            </Link>{" "}
                        </span>
                    )}
                    {canViewContent ? (
                        <span className="whitespace-pre-wrap break-words text-[var(--active-mode)]">{displayedPost.text}</span>
                    ) : (
                        <div className="relative">
                            <span className="whitespace-pre-wrap break-words blur-sm text-[var(--active-mode)]">{displayedPost.text}</span>
                        </div>
                    )}
                </div>

                {/* Image */}
                {displayedPost.photoUrl && (
                    <div onClick={handlePropagation} className="mt-3 relative">
                        <div className="rounded-2xl overflow-hidden border border-solid border-[var(--border-color)]">
                            {canViewContent ? (
                                <Image
                                    onClick={handleImageClick}
                                    src={getFullURL(displayedPost.photoUrl)}
                                    alt="post image"
                                    placeholder="blur"
                                    blurDataURL={shimmer(500, 500)}
                                    height={500}
                                    width={500}
                                    className="w-full object-contain max-h-[510px]"
                                />
                            ) : (
                                <div className="relative">
                                    <Image
                                        src={getFullURL(displayedPost.photoUrl)}
                                        alt="post image"
                                        placeholder="blur"
                                        blurDataURL={shimmer(500, 500)}
                                        height={500}
                                        width={500}
                                        className="w-full object-contain max-h-[510px] blur-md"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="hover:bg-[var(--hover)] text-[var(--text-2)] px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg">
                                            <Lock className="w-6 h-6" />
                                            <span className="text-lg font-bold">
                                                Premium Treasure - Subscribe to Reveal!
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {canViewContent && (
                            <PreviewDialog
                                open={isPreviewOpen}
                                handlePreviewClose={() => setIsPreviewOpen(false)}
                                url={displayedPost.photoUrl}
                            />
                        )}
                    </div>
                )}

                {/* Actions */}
                <div onClick={handlePropagation} className="flex justify-between mt-3 max-w-[425px] text-[var(--text-2)]">
                    <Reply post={displayedPost} />
                    <Repost postId={displayedPost.id} postAuthorId={displayedPost.author.id} />
                    <Like postId={displayedPost.id} postAuthorId={displayedPost.author.id} />
                    <Share postUrl={`https://${window.location.hostname}/${displayedPost.author.username}/posts/${displayedPost.id}`} />
                </div>
            </div>

            {/* Profile Popover */}
            <Popover
                sx={{ pointerEvents: "none" }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                slotProps={{
                    paper: { className: "mt-2 bg-[var(--background-primary)]" }
                }}
            >
                <ProfileCard username={hoveredProfile} token={token} />
            </Popover>
        </motion.div>
    );
}
