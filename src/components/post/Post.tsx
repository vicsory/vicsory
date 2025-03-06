"use client"; // Add this directive at the top

import { Avatar, Popover, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PostProps } from "@/types/PostProps";
import { formatDate, formatDateExtended } from "@/utilities/date";
import { shimmer } from "@/utilities/misc/shimmer";
import Reply from "./Reply";
import Repost from "./Repost";
import Like from "./Like";
import Share from "./Share";
import PreviewDialog from "../dialog/PreviewDialog";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { AuthContext } from "@/app/(vicsory)/layout";
import ProfileCard from "../user/ProfileCard";
import { BadgeCheck, Repeat2 } from "lucide-react";
import Follow from "../user/Follow";

export default function Post({ post }: { post: PostProps }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredProfile, setHoveredProfile] = useState("");

    const { token } = useContext(AuthContext);
    const router = useRouter();

    let displayedPost = post;
    if (post.isRepost) {
        displayedPost = post.repostOf;
    }

    // Check if this is the current user's own post
    const isOwnPost = token?.username === displayedPost.author.username;

    // Determine initial follow status from post.author.followers
    const isFollowingInitially =
        token && displayedPost.author.followers
            ? displayedPost.author.followers.some(
                  (user) => typeof user !== "string" && JSON.stringify(user.id) === JSON.stringify(token.id)
              )
            : false;

    const [isFollowing, setIsFollowing] = useState(isFollowingInitially);

    // Callback to update follow status from Follow component
    const handleFollowChange = (newStatus: boolean) => {
        setIsFollowing(newStatus);
    };

    const handlePostClick = () => {
        router.push(`/${displayedPost.author.username}/posts/${displayedPost.id}`);
    };

    const handlePropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handlePreviewClick();
    };

    const handlePreviewClick = () => {
        setIsPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setIsPreviewOpen(false);
    };

    const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>, type: "default" | "mention" | "repost" = "default") => {
        if (type === "mention" && displayedPost.repliedTo?.author) {
            setHoveredProfile(displayedPost.repliedTo.author.username);
        }
        if (type === "repost") {
            setHoveredProfile(post.author.username);
        }
        if (type === "default") {
            setHoveredProfile(displayedPost.author.username);
        }
        setAnchorEl(e.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <motion.div
            onClick={handlePostClick}
            className="flex px-4 py-3 border-solid border-b border-[var(--border-color)] hover:bg-[var(--hover)] cursor-pointer transition-colors duration-150"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex-shrink-0 mr-3">
                <Link
                    onClick={handlePropagation}
                    href={`/${displayedPost.author.username}`}
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                >
                    <Avatar
                        sx={{ width: 48, height: 48 }}
                        alt=""
                        src={displayedPost.author.photoUrl ? getFullURL(displayedPost.author.photoUrl) : "/assets/egg.jpg"}
                        className="hover:opacity-90 transition-opacity"
                    />
                </Link>
            </div>
            <div className="flex-1 min-w-0">
                {post.isRepost && (
                    <div className="flex items-center text-muted text-sm mb-1">
                        <Repeat2 className="w-4 h-4 mr-2" />
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-wrap">
                        <Link
                            onClick={handlePropagation}
                            href={`/${displayedPost.author.username}`}
                            className="flex items-center gap-1"
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                        >
                            <span className="font-bold text-[15px] hover:underline">
                                {displayedPost.author.name || displayedPost.author.username}
                            </span>
                            {displayedPost.author.isPremium && (
                                <BadgeCheck className="w-4 h-4" fill="#1E90FE" stroke="#fff"/>
                            )}
                            <span className="text-muted text-[15px]">
                                @{displayedPost.author.username}
                            </span>
                        </Link>
                        <Tooltip title={formatDateExtended(displayedPost.createdAt)} placement="top">
                            <span className="text-muted text-[15px]">
                                · {formatDate(displayedPost.createdAt)}
                            </span>
                        </Tooltip>
                    </div>
                    {/* Conditionally render Follow button only if not own post and not following */}
                    {!isOwnPost && !isFollowing && (
                        <Follow
                            profile={displayedPost.author}
                            onFollowChange={handleFollowChange}
                        />
                    )}
                </div>

                <div className="mt-1 text-[15px] leading-5">
                    {displayedPost.isReply && displayedPost.repliedTo?.author && (
                        <span>
                            Replying to{" "}
                            <Link
                                onClick={handlePropagation}
                                href={`/${displayedPost.repliedTo.author.username}`}
                                className="text-[var(--blue)] hover:underline"
                                onMouseEnter={(e) => handlePopoverOpen(e, "mention")}
                                onMouseLeave={handlePopoverClose}
                            >
                                @{displayedPost.repliedTo.author.username}
                            </Link>{" "}
                        </span>
                    )}
                    <span className="whitespace-pre-wrap break-words">{displayedPost.text}</span>
                </div>

                {displayedPost.photoUrl && (
                    <div onClick={handlePropagation} className="mt-3">
                        <div className="rounded-2xl overflow-hidden border border-solid border-[var(--border-color)]">
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
                        </div>
                        <PreviewDialog
                            open={isPreviewOpen}
                            handlePreviewClose={handlePreviewClose}
                            url={displayedPost.photoUrl}
                        />
                    </div>
                )}

                <div onClick={handlePropagation} className="flex justify-between mt-3 max-w-[425px] text-muted">
                    <Reply post={displayedPost} />
                    <Repost postId={displayedPost.id} postAuthor={displayedPost.author.username} />
                    <Like postId={displayedPost.id} postAuthor={displayedPost.author.username} />
                    <Share
                        postUrl={`https://${window.location.hostname}/${displayedPost.author.username}/posts/${displayedPost.id}`}
                    />
                </div>
            </div>

            <Popover
                sx={{ pointerEvents: "none" }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                PaperProps={{ className: "mt-2" }}
            >
                <ProfileCard username={hoveredProfile} token={token} />
            </Popover>
        </motion.div>
    );
}