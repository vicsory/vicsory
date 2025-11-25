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

// Define the type for mutation variables
interface RepostVariables {
  tokenOwnerId: string;
  isReposted: boolean;
}

export default function Repost({ postId, postAuthorId }: PostOptionsProps) {
  const [isReposted, setIsReposted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    message: "",
    severity: "success",
    open: false,
  });

  const { token, isPending } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const queryKey = ["posts", postAuthorId, postId];

  const { isFetched, data } = useQuery({
    queryKey: queryKey,
    queryFn: () => getUserPost(postId, postAuthorId),
  });

  const mutation = useMutation({
    mutationFn: (variables: RepostVariables) =>
      updateReposts(postId, postAuthorId, variables.tokenOwnerId, variables.isReposted),
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

    if (mutation.status === "pending") return;

    const tokenOwnerId = JSON.stringify(token?.id);
    const repostedBy = data?.post?.repostedBy || []; // Fallback to empty array
    const isRepostedBy = repostedBy.some(
      (user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId
    );

    if (isReposted !== isRepostedBy) setIsReposted(isRepostedBy);

    const variables: RepostVariables = {
      tokenOwnerId,
      isReposted,
    };

    mutation.mutate(variables);
  };

  const iconSize = 16;

  useEffect(() => {
    if (!isPending && isFetched && data?.post && token) {
      const tokenOwnerId = JSON.stringify(token?.id);
      const repostedBy = data?.post?.repostedBy || [];
      const isRepostedBy = repostedBy.some(
        (user: { id: string }) => JSON.stringify(user.id) === tokenOwnerId
      );
      setIsReposted(!!isRepostedBy);
    }
  }, [isPending, isFetched, data?.post, token?.id]); 

  return (
    <>
      <motion.button
        className={`flex items-center gap-1 p-2 text-muted rounded-full transition-colors duration-200 ${
          isReposted
            ? "text-green-500"
            : "text-muted"
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
        >
          <Repeat2 size={iconSize} />
        </motion.span>
        {data?.post?.repostedBy?.length > 0 && (
          <span className="text-sm font-medium text-muted">
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