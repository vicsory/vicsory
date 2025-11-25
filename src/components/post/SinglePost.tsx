"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { RxDotsHorizontal } from "react-icons/rx";
import {
    Trash2,
    Edit,
    FileWarning
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { PostProps } from "@/types/PostProps";
import { formatDateExtended } from "@/utilities/date";
import Reply from "./Reply";
import Repost from "./Repost";
import Like from "./Like";
import Share from "./Share";
import Counters from "./Counters";
import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
import { VerifiedToken } from "@/types/TokenProps";
import { deletePost } from "@/utilities/fetch";
import { shimmer } from "@/utilities/fetch/misc/shimmer";
import NewReply from "./NewReply";
import Replies from "./Replies";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import CircularLoading from "../misc/CircularLoading";
import { sleepFunction } from "@/utilities/fetch/misc/sleep";
import { Dialog, DialogContent, DialogTrigger, } from "../ui/dialog";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../public/svg/verify-badge";
import PreviewDialog from "../dialog/PreviewDialog";

export default function SinglePost({ post, token }: { post: PostProps; token: VerifiedToken }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [, setIsReplyOpen] = useState(false);
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
            await sleepFunction();
            queryClient.invalidateQueries({ queryKey: ["posts", post.author.username] });
            router.replace(`/${post.author.username}`);
        },
        onError: (error) => console.log(error),
    });

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
        setIsDeleting(true);
        const jsonId = JSON.stringify(token.id);
        mutation.mutate(jsonId);
    };

    return (
        <div
            className="transition-colors hover:bg-[var(--hover)]/50"
            style={{ borderBottom: "1px solid var(--border-color)", borderStyle: "solid" }}
        >
            <div className="flex gap-3 px-4 py-3">
                {/* Avatar */}
                <div className="flex-shrink-0 pt-0.5">
                    <Link href={`/${post.author.username}`}>
                        <Avatar className="h-10 w-10 hover:opacity-90 transition-opacity">
                            <AvatarImage
                                src={post.author.photoUrl ? getFullURL(post.author.photoUrl) : "/assets/egg.jpg"}
                                alt={post.author.username}
                            />
                            <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <Link
                                href={`/${post.author.username}`}
                                className="flex items-center gap-1 hover:underline truncate"
                            >
                                <span
                                    className="font-semibold text-[16px] truncate"
                                    style={{ color: "var(--active-mode)" }}
                                >
                                    {post.author.name || post.author.username}
                                </span>
                                {post.author.isPremium && (
                                    <BadgeBlue />
                                )}
                                {post.author.isVip && (
                                    <BadgeGold />
                                )}
                                {post.author.isElite && (
                                    <BadgeRed />
                                )}
                            </Link>
                            <span
                                className="text-[14px] truncate"
                                style={{ color: "var(--text-2)" }}
                            >
                                @{post.author.username}
                            </span>
                        </div>
                        {token && token.username === post.author.username && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-[var(--blue)]/10 transition-colors"
                                    >
                                        <RxDotsHorizontal
                                            className="w-5 h-5"
                                            style={{ color: "var(--text-2)" }}
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="rounded-md shadow-lg"
                                    style={{ backgroundColor: "var(--background-primary)" }}
                                >
                                    <DropdownMenuItem
                                        onClick={handleConfirmationClick}
                                        className="hover:bg-[var(--hover)] px-4 py-2 text-[14px] cursor-pointer flex items-center gap-2"
                                        style={{ color: "var(--red)" }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="hover:bg-[var(--hover)] px-4 py-2 text-[14px] cursor-pointer flex items-center gap-2"
                                        style={{ color: "var(--active-mode)" }}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="hover:bg-[var(--hover)] px-4 py-2 text-[14px] cursor-pointer flex items-center gap-2"
                                        style={{ color: "var(--active-mode)" }}
                                    >
                                        <FileWarning className="w-4 h-4" />
                                        Report
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Post Body */}
                    <div className="space-y-2">
                        {post.isReply && post.repliedTo && (
                            <div
                                className="text-[13px] mb-1"
                                style={{ color: "var(--text-2)" }}
                            >
                                Replying to{" "}
                                <Link
                                    href={`/${post.repliedTo?.author.username}`}
                                    className="hover:underline"
                                    style={{ color: "var(--blue)" }}
                                >
                                    @{post.repliedTo?.author.username}
                                </Link>
                            </div>
                        )}

                        <p
                            className="text-[15px] leading-5 whitespace-pre-wrap break-words"
                            style={{ color: "var(--active-mode)" }}
                        >
                            {post.text}
                        </p>
                        {post.photoUrl && (
                            <div className="mt-2 rounded-xl overflow-hidden border-solid border max-w-[550px]" style={{ borderColor: "var(--border-color)" }}>
                                <Image
                                    onClick={handleImageClick}
                                    src={getFullURL(post.photoUrl)}
                                    alt="post image"
                                    placeholder="blur"
                                    blurDataURL={shimmer(550, 310)}
                                    width={550}
                                    height={310}
                                    className="w-full object-cover cursor-pointer"
                                />
                                <PreviewDialog
                                    open={isPreviewOpen}
                                    handlePreviewClose={handlePreviewClose}
                                    url={post.photoUrl}
                                />
                            </div>
                        )}
                        <div
                            className="text-[13px]"
                            style={{ color: "var(--text-2)" }}
                        >
                            {formatDateExtended(post.createdAt)}
                        </div>
                    </div>

                    {/* Actions */}
                    <div
                        className="flex justify-between mt-3.5 w-full border-t border-b border-solid border-[var(--border-color)] pt-2"
                        style={{ color: "var(--text-2)" }}
                    >
                        <Reply post={post} />
                        <Repost postId={post.id} postAuthorId={post.author.username} />
                        <Like postId={post.id} postAuthorId={post.author.username} />
                        <Share
                            postUrl={`https://${window.location.hostname}/${post.author.username}/posts/${post.id}`}
                        />
                    </div>

                    <Counters post={post} />

                    {/* Reply Popover */}
                    {token && (



                        <div className="flex gap-2 items-center my-4">
                            <Dialog >
                                <Link href={`/${post.author.username}`}>
                                    <Avatar className="h-10 w-10 hover:opacity-90 transition-opacity border-2 border-solid border-[var(--border-color)]">
                                        <AvatarImage
                                            src={post.author.photoUrl ? getFullURL(post.author.photoUrl) : "/assets/egg.jpg"}
                                            alt={post.author.username}
                                        />
                                        <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <DialogTrigger asChild className="w-full rounded-3xl bg-[var(--hover)] text-left justify-start flex p-4  resize-none border border-[var(--border-color)] focus-visible:ring-1 focus-visible:ring-[var(--blue)] focus-visible:border-[var(--blue)] placeholder:text-[var(--text-2)] transition-all duration-200">
                                    <Button variant="ghost" className="text-muted">Write your reply</Button>
                                </DialogTrigger>
                                <DialogContent className="w-[520px]">
                                    <NewReply token={token} post={post} onSuccess={() => setIsReplyOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}

                    {post.replies.length > 0 && <Replies postId={post.id} postAuthorId={post.author.username} />}
                </div>
            </div>

            {/* Additional Components */}
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}

            {/* Delete Confirmation Dialog */}
            {isConfirmationOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
                    <div
                        className="rounded-xl p-6 w-full max-w-[440px] mx-4 shadow-2xl border-solid border"
                        style={{ backgroundColor: "var(--background-primary)", borderColor: "var(--border-color)" }}
                    >
                        <h2
                            className="text-xl font-semibold mb-4"
                            style={{ color: "var(--active-mode)" }}
                        >
                            Delete Post?
                        </h2>
                        <p
                            className="text-[14px] leading-5 mb-6"
                            style={{ color: "var(--text-2)" }}
                        >
                            This action cannot be undone. The post will be permanently removed from your profile, followers'
                            timelines, and search results.
                        </p>
                        {isDeleting ? (
                            <div className="flex justify-center">
                                <CircularLoading />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Button
                                    className="w-full rounded-full py-2.5 text-[15px] font-semibold transition-colors shadow-sm"
                                    style={{
                                        backgroundColor: "var(--red)",
                                        color: "var(--background-primary)",
                                    }}
                                    onClick={handleDelete}
                                    onMouseOver={(e) =>
                                        (e.currentTarget.style.backgroundColor = "var(--hover-red)")
                                    }
                                    onMouseOut={(e) =>
                                        (e.currentTarget.style.backgroundColor = "var(--red)")
                                    }
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-full py-2.5 text-[15px] font-semibold transition-colors shadow-sm border-solid"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "var(--active-mode)",
                                        borderColor: "var(--border-color)",
                                    }}
                                    onClick={() => setIsConfirmationOpen(false)}
                                    onMouseOver={(e) =>
                                        (e.currentTarget.style.backgroundColor = "var(--hover)")
                                    }
                                    onMouseOut={(e) =>
                                        (e.currentTarget.style.backgroundColor = "transparent")
                                    }
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}