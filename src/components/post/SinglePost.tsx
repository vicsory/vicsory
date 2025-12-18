import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { RxDotsHorizontal } from "react-icons/rx";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { AiFillTwitterCircle } from "react-icons/ai";

import { PostProps } from "@/types/PostProps";
import { formatDateExtended } from "@/utilities/date";
import Reply from "./Reply";
import Repost from "./Repost";
import Like from "./Like";
import Share from "./Share";
import Counters from "./Counters";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { VerifiedToken } from "@/types/TokenProps";
import { deletePost } from "@/utilities/fetch";
import PreviewDialog from "../dialog/PreviewDialog";
import { shimmer } from "@/utilities/misc/shimmer";
import NewReply from "./NewReply";
import Replies from "./Replies";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import CircularLoading from "../misc/CircularLoading";
import { sleepFunction } from "@/utilities/misc/sleep";

export default function SinglePost({ post, token }: { post: PostProps; token: VerifiedToken }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (jsonId: string) => deletePost(post.id, post.authorId, jsonId),
        onSuccess: async () => {
            setIsConfirmationOpen(false);
            setIsDeleting(false);
            setSnackbar({
                message: "Post deleted successfully. Redirecting to the profile page...",
                severity: "success",
                open: true,
            });
            await sleepFunction(); // for waiting snackbar to acknowledge delete for better user experience
            queryClient.invalidateQueries(["posts", post.author.username]);
            router.replace(`/${post.author.username}`);
        },
        onError: (error) => console.log(error),
    });

    const handleAnchorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleAnchorClose = () => {
        setAnchorEl(null);
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
    const handleConfirmationClick = () => {
        handleAnchorClose();
        setIsConfirmationOpen(true);
    };

    const handleDelete = async () => {
        if (!token) {
            return setSnackbar({
                message: "You must be logged in to delete posts...",
                severity: "info",
                open: true,
            });
        }
        handleAnchorClose();
        setIsDeleting(true);
        const jsonId = JSON.stringify(token.id);
        mutation.mutate(jsonId);
    };

    return (
        <div>
            <div className={`single-post post ${post.isReply && "reply"}`}>
                <div className="single-post-author-section">
                    <div>
                        <Link className="post-avatar" href={`/${post.author.username}`}>
                            <Avatar
                                className="avatar"
                                sx={{ width: 50, height: 50 }}
                                alt=""
                                src={post.author.photoUrl ? getFullURL(post.author.photoUrl) : "/assets/egg.jpg"}
                            />
                        </Link>
                    </div>
                    <div className="post-author-section">
                        <Link className="post-author-link" href={`/${post.author.username}`}>
                            <span className="post-author">
                                {post.author.name !== "" ? post.author.name : post.author.username}
                                {post.author.isPremium && (
                                    <span className="blue-tick" data-blue="Verified Blue">
                                        <AiFillTwitterCircle />
                                    </span>
                                )}
                            </span>
                            <span className="text-[var(--text-secondary)]">@{post.author.username}</span>
                        </Link>
                        {token && token.username === post.author.username && (
                            <>
                                <button className="three-dots icon-hoverable" onClick={handleAnchorClick}>
                                    <RxDotsHorizontal />
                                </button>
                                <Menu anchorEl={anchorEl} onClose={handleAnchorClose} open={Boolean(anchorEl)}>
                                    <MenuItem onClick={handleConfirmationClick} className="delete">
                                        Delete
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </div>
                </div>
                <div className="post-main">
                    <div className="post-text">
                        {post.isReply && (
                            <Link href={`/${post.repliedTo.author.username}`} className="reply-to">
                                <span className="mention">@{post.repliedTo.author.username}</span>
                            </Link>
                        )}{" "}
                        {post.text}
                    </div>
                    {post.photoUrl && (
                        <>
                            <div className="post-image">
                                <Image
                                    onClick={handleImageClick}
                                    src={getFullURL(post.photoUrl)}
                                    alt="post image"
                                    placeholder="blur"
                                    blurDataURL={shimmer(500, 500)}
                                    height={500}
                                    width={500}
                                />
                            </div>
                            <PreviewDialog
                                open={isPreviewOpen}
                                handlePreviewClose={handlePreviewClose}
                                url={post.photoUrl}
                            />
                        </>
                    )}
                    <span className="text-[var(--text-secondary)] date">{formatDateExtended(post.createdAt)}</span>
                    <Counters post={post} />
                    <div className="post-bottom">
                        <Reply post={post} />
                        <Repost postId={post.id} postAuthor={post.author.username} />
                        <Like postId={post.id} postAuthor={post.author.username} />
                        <Share
                            postUrl={`https://${window.location.hostname}/${post.author.username}/posts/${post.id}`}
                        />
                    </div>
                </div>
            </div>
            {token && <NewReply token={token} post={post} />}
            {post.replies.length > 0 && <Replies postId={post.id} postAuthor={post.author.username} />}
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}
            {isConfirmationOpen && (
                <div className="html-modal-wrapper">
                    <dialog open className="confirm">
                        <h1>Delete Post?</h1>
                        <p>
                            This can’t be undone and it will be removed from your profile, the timeline of any accounts that
                            follow you, and from Twitter search results.
                        </p>
                        {isDeleting ? (
                            <CircularLoading />
                        ) : (
                            <>
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    Delete
                                </button>
                                <button className="btn btn-white" onClick={() => setIsConfirmationOpen(false)}>
                                    Cancel
                                </button>
                            </>
                        )}
                    </dialog>
                </div>
            )}
        </div>
    );
}
