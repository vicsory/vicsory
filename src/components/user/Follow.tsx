"use client";

import { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "@/app/(vicsory)/layout";
import { updateUserFollows } from "@/utilities/fetch";
import { UserProps } from "@/types/UserProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";

export default function Follow({
    profile,
    onFollowChange,
    initialFollowStatus, // New prop
}: {
    profile: UserProps;
    onFollowChange?: (newStatus: boolean) => void;
    initialFollowStatus?: boolean;
}) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        message: "",
        severity: "success",
        open: false,
    });

    const { token, isPending } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const queryKey = ["users", profile.username];
    const [isFollowed, setIsFollowed] = useState(initialFollowStatus ?? false);

    // Initialize follow status only if initialFollowStatus isn’t provided
    useEffect(() => {
        if (typeof initialFollowStatus === "boolean") {
            setIsFollowed(initialFollowStatus);
        } else if (!isPending && token && profile.followers) {
            const tokenOwnerId = JSON.stringify(token.id);
            const isFollowing = profile.followers.some(
                (user) => typeof user !== "string" && JSON.stringify(user.id) === tokenOwnerId
            );
            setIsFollowed(isFollowing);
        }
    }, [isPending, token, profile.followers, initialFollowStatus]);

    const followMutation = useMutation({
        mutationFn: (tokenOwnerId: string) => updateUserFollows(profile.username, tokenOwnerId, false),
        onMutate: async (tokenOwnerId: string) => {
            setIsButtonDisabled(true);
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<{ user: { followers: Array<{ id: string }> } }>(queryKey);
            setIsFollowed(true);
            if (previous) {
                queryClient.setQueryData(queryKey, {
                    ...previous,
                    user: {
                        ...previous.user,
                        followers: [...previous.user.followers, { id: tokenOwnerId }],
                    },
                });
            }
            return { previous };
        },
        onError: (err: Error, variables, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
            setIsFollowed(false);
            setIsButtonDisabled(false);
            setSnackbar({
                message: err.message || "Failed to follow user",
                severity: "error",
                open: true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            onFollowChange?.(true);
            setIsButtonDisabled(false);
            setSnackbar({
                message: "Successfully followed user",
                severity: "success",
                open: true,
            });
        },
    });

    const unfollowMutation = useMutation({
        mutationFn: (tokenOwnerId: string) => updateUserFollows(profile.username, tokenOwnerId, true),
        onMutate: async (tokenOwnerId: string) => {
            setIsButtonDisabled(true);
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<{ user: { followers: Array<{ id: string }> } }>(queryKey);
            setIsFollowed(false);
            if (previous) {
                queryClient.setQueryData(queryKey, {
                    ...previous,
                    user: {
                        ...previous.user,
                        followers: previous.user.followers.filter(
                            (user) => typeof user !== "string" && JSON.stringify(user.id) !== tokenOwnerId
                        ),
                    },
                });
            }
            return { previous };
        },
        onError: (err: Error, variables, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
            setIsFollowed(true);
            setIsButtonDisabled(false);
            setSnackbar({
                message: err.message || "Failed to unfollow user",
                severity: "error",
                open: true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            onFollowChange?.(false);
            setIsButtonDisabled(false);
            setSnackbar({
                message: "Successfully unfollowed user",
                severity: "success",
                open: true,
            });
        },
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsButtonDisabled(false), 1500);
        return () => clearTimeout(timer);
    }, [isButtonDisabled]);

    const handleFollowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!token) {
            return setSnackbar({
                message: "You need to login first to follow someone.",
                severity: "info",
                open: true,
            });
        }

        const tokenOwnerId = JSON.stringify(token.id);
        if (!followMutation.isLoading && !unfollowMutation.isLoading) {
            isFollowed
                ? unfollowMutation.mutate(tokenOwnerId)
                : followMutation.mutate(tokenOwnerId);
        }
    };

    return (
        <>
            <button
                onClick={handleFollowClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={isButtonDisabled}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out
                    ${isFollowed
                        ? "bg-transparent border border-[var(--border-color)] text-[var(--text)] hover:bg-[var(--hover)]"
                        : "bg-[var(--blue)] text-white border border-[var(--hover-blue)] hover:bg-[var(--hover-blue)]"
                    }
                    ${isButtonDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
                {isFollowed ? (isHovered ? "Unfollow" : "Following") : "Follow"}
            </button>
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