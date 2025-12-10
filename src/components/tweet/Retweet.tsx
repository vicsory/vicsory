"use client";

import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiShare, FiCopy, FiMail, FiX } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";

import { TweetOptionsProps } from "@/types/TweetProps";
import { getUserTweet, updateRetweets } from "@/utilities/fetch";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import { AuthContext } from "@/contexts/auth-context";
import RepostIcon from "../../../public/svg/repost";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function RetweetShare({ tweetId, tweetAuthor, tweetUrl }: TweetOptionsProps & { tweetUrl: string }) {
    const [isRetweeted, setIsRetweeted] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
    const [quoteText, setQuoteText] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    const { token, isPending, user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const { isFetched, data } = useQuery({
        queryKey: ["tweets", tweetAuthor, tweetId],
        queryFn: () => getUserTweet(tweetId, tweetAuthor),
    });

    const mutation = useMutation({
        mutationFn: (variables: any) =>
            updateRetweets(tweetId, tweetAuthor, variables.tokenOwnerId, variables.isRetweeted),
        onMutate: () => setIsButtonDisabled(true),
        onSuccess: () => {
            setIsButtonDisabled(false);
            queryClient.invalidateQueries({ queryKey: ["tweets"] });
            queryClient.invalidateQueries({ queryKey: ["timeline"] });
        },
        onError: (error) => {
            console.log(error);
            setIsButtonDisabled(false);
        },
    });

    const handleSimpleRetweet = () => {
        if (!token) {
            setSnackbar({ message: "You need to login to repost.", severity: "info", open: true });
            return;
        }
        mutation.mutate({ tokenOwnerId: JSON.stringify(token?.id), isRetweeted: !isRetweeted });
    };

    const handleQuoteRepost = async () => {
        if (!token) return;
        setSnackbar({ message: "Reposted with your comment!", severity: "success", open: true });
        setIsQuoteDialogOpen(false);
        setQuoteText("");
        if (!isRetweeted) mutation.mutate({ tokenOwnerId: JSON.stringify(token?.id), isRetweeted: true });
        queryClient.invalidateQueries({ queryKey: ["tweets"] });
        queryClient.invalidateQueries({ queryKey: ["timeline"] });
    };

    useEffect(() => {
        if (!isPending && isFetched && token) {
            const tokenOwnerId = JSON.stringify(token.id);
            const alreadyRetweeted = (data?.tweet?.retweetedBy || []).some((u: any) => JSON.stringify(u.id) === tokenOwnerId);
            setIsRetweeted(alreadyRetweeted);
        }

        // Detect mobile
        const handleResize = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isPending, isFetched, data, token]);

    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tweetUrl)}`;
    const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(tweetUrl)}`;
    const linkedinShare = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(tweetUrl)}`;
    const whatsappShare = `https://wa.me/?text=${encodeURIComponent(tweetUrl)}`;
    const emailShare = `mailto:?subject=Check this out&body=${encodeURIComponent(tweetUrl)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(tweetUrl);
        setSnackbar({ message: "Link copied to clipboard!", severity: "success", open: true });
    };

    const openWindow = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

    return (
        <>
            <div className="flex items-center gap-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <motion.button
                            className={`flex items-center gap-2 transition-colors ${isRetweeted ? "text-[var(--text-secondary)]" : "text-[var(--text)] hover:text-[var(--text-secondary)]"} disabled:opacity-50 disabled:cursor-not-allowed`}
                            whileTap={{ scale: 0.9 }}
                            disabled={isButtonDisabled}
                        >
                            <motion.span animate={{ scale: isRetweeted ? [1, 1.5, 1.2, 1] : 1 }}>
                                <RepostIcon className="w-5 h-5" />
                            </motion.span>
                            {data?.tweet?.retweetedBy?.length > 0 && (
                                <span className="text-sm font-bold ml-1">{data.tweet.retweetedBy.length}</span>
                            )}
                        </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="center" className="w-64 p-2 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] shadow-xl">
                        <DropdownMenuItem onClick={handleSimpleRetweet} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--background-hover)] cursor-pointer">
                            <RepostIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                            <div>
                                <div className="font-semibold">Repost</div>
                                <div className="text-xs text-[var(--text)]">Share this post directly</div>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsQuoteDialogOpen(true)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--background-hover)] cursor-pointer">
                            <svg className="w-5 h-5 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                                <path d="M9 12h6v2H9zm0 4h6v2H9z" />
                            </svg>
                            <div>
                                <div className="font-semibold">Repost with comment</div>
                                <div className="text-xs text-[var(--text-muted)]">Add your thoughts and share</div>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openWindow(facebookShare)} className="flex gap-3 p-2 rounded-xl hover:bg-[var(--background-hover)]"><FaFacebook className="text-blue-600 text-xl" />Facebook</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openWindow(whatsappShare)} className="flex gap-3 p-2 rounded-xl hover:bg-[var(--background-hover)]"><FaWhatsapp className="text-green-400 text-xl" />WhatsApp</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openWindow(twitterShare)} className="flex gap-3 p-2 rounded-xl hover:bg-[var(--background-hover)]"><FaTwitter className="text-sky-500 text-xl" />X (Twitter)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openWindow(linkedinShare)} className="flex gap-3 p-2 rounded-xl hover:bg-[var(--background-hover)]"><FaLinkedin className="text-blue-700 text-xl" />LinkedIn</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openWindow(emailShare)} className="flex gap-3 p-2 rounded-xl hover:bg-[var(--background-hover)]"><FiMail className="text-green-600 text-xl" />Email</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopy} className="flex gap-3 p-2 rounded-xl hover:bg-[var(--background-hover)]"><FiCopy className="text-purple-600 text-xl" />Copy link</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* QUOTE REPOST – MOBILE DRAWER / DESKTOP DIALOG */}
            <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
                <DialogContent className={`${isMobile ? "fixed bottom-0 inset-x-0 h-[80vh] rounded-t-2xl p-4" : "sm:max-w-lg bg-[var(--background)] border-[var(--border)] rounded-2xl"} bg-[var(--background)] border-[var(--border)]`}>
                    <DialogHeader className="border-b border-[var(--border)] pb-4">
                        <DialogTitle className="text-xl font-bold flex items-center justify-between">
                            Repost with your thoughts
                            <button onClick={() => setIsQuoteDialogOpen(false)}>
                                <FiX className="w-6 h-6 text-[var(--text-muted)] hover:text-[var(--text)]" />
                            </button>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar>
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold">{user?.name || "Your Name"}</div>
                                <div className="text-sm text-[var(--text-muted)]">Public • Just now</div>
                            </div>
                        </div>

                        <TextareaAutosize
                            autoFocus
                            placeholder="Add a comment..."
                            value={quoteText}
                            onChange={(e) => setQuoteText(e.target.value)}
                            className="w-full bg-transparent text-lg resize-none outline-none placeholder:text-[var(--text-muted)]"
                            minRows={3}
                            maxLength={280}
                        />
                        <div className="text-right text-xs text-[var(--text-muted)] mt-1">{quoteText.length}/280</div>

                        <div className="mt-5 p-4 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
                            <div className="text-sm text-[var(--text)]">{data?.tweet?.content || "Original post content..."}</div>
                            {data?.tweet?.media?.length > 0 && (
                                <img src={data.tweet.media[0].url} alt="preview" className="mt-3 rounded-xl max-h-64 object-cover w-full" />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border)]">
                        <Button variant="ghost" onClick={() => setIsQuoteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleQuoteRepost} disabled={!quoteText.trim() && quoteText.length === 0} className="bg-[var(--text-secondary)] hover:bg-[var(--text-secondary-hover)] text-white">Repost</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {snackbar.open && <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />}
        </>
    );
}
