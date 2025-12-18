"use client";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { PostOptionsProps } from "@/types/PostProps";
import { getUserPost, updateReposts } from "@/utilities/fetch";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import { AuthContext } from "@/contexts/auth-context";
import RepostIcon from "../../../public/svg/repost";

export default function Repost({ postId, postAuthor }: PostOptionsProps) {
    const [isReposted, setIsReposted] = useState(false);
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

    const mutation = useMutation({
        mutationFn: (variables: any) =>
            updateReposts(postId, postAuthor, variables.tokenOwnerId, variables.isReposted),
        onMutate: () => {
            setIsButtonDisabled(true);
            setIsReposted(!isReposted);
        },
        onSuccess: () => {
            setIsButtonDisabled(false);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => console.log(error),
    });

    const handleRepost = () => {
        if (!token) {
            return setSnackbar({
                message: "You need to login to repost.",
                severity: "info",
                open: true,
            });
        }

        if (mutation.isLoading) return;

        const tokenOwnerId = JSON.stringify(token?.id);
        const repostedBy = data?.post?.repostedBy;
        const isRepostedBy = repostedBy?.some(
            (user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId
        );

        if (isReposted !== isRepostedBy) setIsReposted(isRepostedBy);

        mutation.mutate({
            tokenOwnerId,
            isReposted,
        });
    };

    useEffect(() => {
        if (!isPending && isFetched) {
            const tokenOwnerId = JSON.stringify(token?.id);
            const repostedBy = data?.post?.repostedBy;
            const isRepostedBy = repostedBy?.some(
                (user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId
            );
            setIsReposted(isRepostedBy);
        }
    }, [isPending, isFetched, data]);

    return (
        <>
            <motion.button
                onClick={handleRepost}
                disabled={isButtonDisabled}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isReposted ? [1, 1.5, 1.2, 1] : 1 }}
                transition={{ duration: 0.25 }}
                className={`flex cursor-pointer items-center gap-1 p-2 rounded-full transition-colors 
                    ${isReposted ? "text-[var(--green)]" : "text-[var(--text)] hover:text-[var(--text-secondary)]"}`}
            >
                <motion.span animate={{ scale: [1, 1.5, 1.2, 1] }} transition={{ duration: 0.25 }}>
                    <RepostIcon />
                </motion.span>

                {/* Pop animation bubble */}
                <motion.span
                    animate={{ scale: isReposted ? [0, 1.2, 1] : 0 }}
                    transition={{ duration: 0.25 }}
                    className="inline-block"
                />

                {/* Count */}
                {data?.post?.repostedBy?.length ? (
                    <span className="text-base font-bold text-[var(--text)]">{data?.post?.repostedBy?.length}</span>
                ) : null}
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
