"use client";

import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PostOptionsProps, PostResponse } from "@/types/PostProps";
import { getUserPost, updatePostLikes } from "@/utilities/fetch";
import { AuthContext } from "@/app/(vicsory)/layout";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import { UserProps } from "@/types/UserProps";
import { Heart } from "lucide-react";

export default function Like({ postId, postAuthor }: PostOptionsProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        message: "",
        severity: "success",
        open: false,
    });

    const { token, isPending } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const queryKey = ["posts", postAuthor, postId];

    const { isFetched, data } = useQuery({
        queryKey: queryKey,
        queryFn: () => getUserPost(postId, postAuthor),
    });

    const likeMutation = useMutation({
        mutationFn: (tokenOwnerId: string) =>
            updatePostLikes(postId, postAuthor, tokenOwnerId, false),
        onMutate: async (tokenOwnerId: string) => {
            setIsButtonDisabled(true);
            await queryClient.cancelQueries({ queryKey: queryKey });
            const previousPost = queryClient.getQueryData<PostResponse>(queryKey);
            setIsLiked(true);
            if (previousPost) {
                queryClient.setQueryData(queryKey, {
                    ...previousPost,
                    post: {
                        ...previousPost.post,
                        likedBy: [...previousPost.post.likedBy, tokenOwnerId],
                    },
                });
            }
            return { previousPost };
        },
        onError: (err, variables, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData<PostResponse>(queryKey, context.previousPost);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
    });

    const unlikeMutation = useMutation({
        mutationFn: (tokenOwnerId) =>
            updatePostLikes(postId, postAuthor, tokenOwnerId, true),
        onMutate: async (tokenOwnerId: string) => {
            setIsButtonDisabled(true);
            await queryClient.cancelQueries({ queryKey: queryKey });
            const previous = queryClient.getQueryData<PostResponse>(queryKey);
            setIsLiked(false);
            if (previous) {
                queryClient.setQueryData(queryKey, {
                    ...previous,
                    post: {
                        ...previous.post,
                        likedBy: previous.post.likedBy.filter(
                            (user: UserProps) => JSON.stringify(user.id) !== tokenOwnerId
                        ),
                    },
                });
            }
            return { previous };
        },
        onError: (err, variables, context) => {
            if (context?.previous) {
                queryClient.setQueryData<PostResponse>(queryKey, context.previous);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
    });

    const handleLike = () => {
        if (!token) {
            return setSnackbar({
                message: "You need to login to like a post.",
                severity: "info",
                open: true,
            });
        }

        if (!data || !data.post) return;

        const tokenOwnerId = JSON.stringify(token.id);
        const likedBy = data.post.likedBy || [];
        const isLikedByTokenOwner = likedBy.some(
            (user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId
        );

        if (likeMutation.status !== 'pending' && unlikeMutation.status !== 'pending') {
            if (isLikedByTokenOwner) {
                unlikeMutation.mutate(tokenOwnerId);
            } else {
                likeMutation.mutate(tokenOwnerId);
            }
        }
    };

    useEffect(() => {
        if (!isPending && isFetched && data?.post && token) {
            const tokenOwnerId = JSON.stringify(token?.id);
            const likedBy = data?.post?.likedBy || [];
            const isLikedByTokenOwner = likedBy.some(
                (user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId
            );
            setIsLiked(!!isLikedByTokenOwner); // Ensure boolean value
        }
    }, [isPending, isFetched, data?.post?.likedBy, token?.id]); // Added missing dependencies

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsButtonDisabled(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [isButtonDisabled]);

    const iconSize = 16;

    return (
        <>
            <motion.button
                className={`flex items-center gap-1 p-2 rounded-full transition-colors duration-200 ${
                    isLiked
                        ? "text-red-500 hover:bg-red-50"
                        : "text-red-500 hover:bg-gray-100"
                } ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={handleLike}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isLiked ? [1, 1.5, 1.2, 1] : 1 }}
                transition={{ duration: 0.25 }}
                disabled={isButtonDisabled}
            >
                {isLiked ? (
                    <motion.span
                        animate={{ scale: [1, 1.5, 1.2, 1] }}
                        transition={{ duration: 0.25 }}
                    >
                        <Heart size={iconSize} className="fill-red-500" />
                    </motion.span>
                ) : (
                    <motion.span
                        animate={{ scale: [1, 0.8, 1] }}
                        transition={{ duration: 0.25 }}
                    >
                        <Heart size={iconSize} />
                    </motion.span>
                )}
                {data?.post?.likedBy?.length > 0 && (
                    <span className="text-sm font-medium text-red-500">
                        {data.post.likedBy.length}
                    </span>
                )}
            </motion.button>
            {snackbar.open && (
                <CustomSnackbar
                    message={snackbar.message}
                    severity={snackbar.severity}
                    setSnackbar={setSnackbar}
                />
            )}
        </>
    );
}