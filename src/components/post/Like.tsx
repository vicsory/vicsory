import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";

import { PostOptionsProps, PostResponse } from "@/types/PostProps";
import { getUserPost, updatePostLikes } from "@/utilities/fetch";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import { UserProps } from "@/types/UserProps";
import { AuthContext } from "@/contexts/auth-context";
import { HeartFillIcon, HeartOutlineIcon } from "../../../public/svg/heart";

export default function Like({ postId, postAuthor }: PostOptionsProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const { token, isPending } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const queryKey = ["posts", postAuthor, postId];

    const { isFetched, data } = useQuery({
        queryKey: queryKey,
        queryFn: () => getUserPost(postId, postAuthor),
    });

    const likeMutation = useMutation({
        mutationFn: (tokenOwnerId: string) => updatePostLikes(postId, postAuthor, tokenOwnerId, false),
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
        mutationFn: (tokenOwnerId: string) => updatePostLikes(postId, postAuthor, tokenOwnerId, true),
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

        const tokenOwnerId = JSON.stringify(token.id);

        const likedBy = data?.post?.likedBy ?? [];
        const isLikedByTokenOwner = likedBy.some(
            (user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId
        );


        if (!likeMutation.isLoading && !unlikeMutation.isLoading) {
            if (isLikedByTokenOwner) {
                unlikeMutation.mutate(tokenOwnerId);
            } else {
                likeMutation.mutate(tokenOwnerId);
            }
        }

    };

    useEffect(() => {
        if (!isPending && isFetched) {
            const tokenOwnerId = JSON.stringify(token?.id);
            const likedBy = data?.post?.likedBy;
            const isLikedByTokenOwner = likedBy?.some((user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId);
            setIsLiked(isLikedByTokenOwner);
        }
    }, [isPending, isFetched, data?.post?.likedBy, token?.id]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsButtonDisabled(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [isButtonDisabled]);

    return (
        <>
            <motion.button
                className={`flex items-center space-x-1 transition-colors  ${isLiked ? "text-[var(--blue)]" : "text-[var(--text)] hover:text-[var(--text-secondary)]"}
                disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={handleLike}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isLiked ? [1, 1.5, 1.2, 1] : 1 }}
                transition={{ duration: 0.25 }}
                disabled={isButtonDisabled}
            >
                {isLiked ? (
                    <motion.span animate={{ scale: [1, 1.5, 1.2, 1] }} transition={{ duration: 0.25 }}>
                        <HeartFillIcon />
                    </motion.span>
                ) : (
                    <motion.span animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 0.25 }}>
                        <HeartOutlineIcon />
                    </motion.span>
                )}
                <motion.span animate={{ scale: isLiked ? [0, 1.2, 1] : 0 }} transition={{ duration: 0.25 }} />
                {data?.post?.likedBy?.length === 0 ? null : <span className="text-base font-bold text-[var(--text)]">{data?.post?.likedBy?.length}</span>}
            </motion.button>
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}
        </>
    );
}
