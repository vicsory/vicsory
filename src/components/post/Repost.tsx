"use client";

import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { PostOptionsProps } from "@/types/PostProps";
import { AuthContext } from "@/app/(vicsory)/layout";
import { getUserPost, updateReposts } from "@/utilities/fetch";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import { Repeat2 } from "lucide-react";

export default function Repost({ postId, postAuthor }: PostOptionsProps) {
    const [isReposted, setIsReposted] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const { token, isPending } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const queryKey = ["posts", postAuthor, postId];

    const { isFetched, data } = useQuery({
        queryKey: queryKey,
        queryFn: () => getUserPost(postId, postAuthor),
    });

    const mutation = useMutation({
        mutationFn: (variables: any) => updateReposts(postId, postAuthor, variables.tokenOwnerId, variables.isReposted),
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

        if (mutation.status === 'pending') return;

        const tokenOwnerId = JSON.stringify(token?.id);
        const repostedBy = data?.post?.repostedBy;
        const isRepostedBy = repostedBy?.some((user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId);

        if (isReposted !== isRepostedBy) setIsReposted(isRepostedBy);

        const variables = {
            tokenOwnerId,
            isReposted,
        };

        mutation.mutate(variables);
    };

    const iconSize = 16;

    useEffect(() => {
        if (!isPending && isFetched) {
            const tokenOwnerId = JSON.stringify(token?.id);
            const repostedBy = data?.post?.repostedBy;
            const isRepostedBy = repostedBy?.some((user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId);
            setIsReposted(isRepostedBy);
        }
    }, [isPending, isFetched, data]);

    return (
        <>
            <motion.button
                className={`flex items-center gap-1 p-2 rounded-full transition-colors duration-200 ${
                    isReposted 
                        ? "text-green-500 hover:bg-green-50" 
                        : "text-gray-500 hover:bg-gray-100"
                } ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={handleRepost}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isReposted ? [1, 1.5, 1.2, 1] : 1 }}
                transition={{ duration: 0.25 }}
                disabled={isButtonDisabled}
            >
                <motion.span 
                    animate={{ scale: [1, 1.5, 1.2, 1] }} 
                    transition={{ duration: 0.25 }}
                    className="w-5 h-5"
                >
                    <Repeat2 size={iconSize} />
                </motion.span>
                {data?.post?.repostedBy?.length > 0 && (
                    <span className="text-sm font-medium text-gray-600">
                        {data.post.repostedBy.length}
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