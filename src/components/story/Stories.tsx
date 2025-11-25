"use client";

import { addStory } from "@/utilities/fetch";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProps } from "@/types/UserProps";
import { Plus, X } from "lucide-react";
import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
import { supabase, uploadFile } from "@/utilities/storage";

type StoryWithUser = {
    id: number;
    photoUrl: string;
    createdAt: Date;
    expiresAt: Date;
    userId: string;
    user: {
        id: string;
        username: string;
        photoUrl?: string | null;
    } | null; // Allow null to match API
};

interface StoriesProps {
    stories: StoryWithUser[];
    userId: string;
    token: UserProps;
}

const fetchStories = async (): Promise<StoryWithUser[]> => {
    const response = await fetch("/api/stories", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch stories");
    return json.data;
};

const STORY_DURATION = 5000;

const Stories = ({ stories: initialStories, userId, token: initialToken }: StoriesProps) => {
    const queryClient = useQueryClient();
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { data: currentStories = initialStories, isLoading } = useQuery({
        queryKey: ["stories"],
        queryFn: fetchStories,
        initialData: initialStories,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });

    useEffect(() => {
        const syncAuth = async () => {
            const cookies = Object.fromEntries(
                document.cookie.split("; ").map((c) => c.split("="))
            );
            const cookieToken = cookies["token"];
            setAuthToken(cookieToken || null);
        };

        syncAuth();

        return () => {
            if (imgPreview) URL.revokeObjectURL(imgPreview);
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [imgPreview]);

    const addStoryMutation = useMutation({
        mutationFn: async (file: File) => {
            const path = await uploadFile(file);
            if (!path) throw new Error("Failed to upload file");
            const { data: { publicUrl } } = supabase.storage
                .from("vicsory")
                .getPublicUrl(path);
            return addStory({ photoUrl: publicUrl });
        },
        onMutate: async (file) => {
            await queryClient.cancelQueries({ queryKey: ["stories"] });
            const previousStories = queryClient.getQueryData<StoryWithUser[]>(["stories"]) || initialStories;
            const tempId = Date.now();
            const optimisticStory: StoryWithUser = {
                id: tempId,
                photoUrl: URL.createObjectURL(file),
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                userId,
                user: {
                    id: initialToken.id,
                    username: initialToken.username,
                    photoUrl: initialToken.photoUrl,
                },
            };

            queryClient.setQueryData<StoryWithUser[]>(["stories"], (old) => [
                optimisticStory,
                ...(old || initialStories).filter((s) => s.id !== tempId),
            ]);

            return { previousStories, tempId };
        },
        onSuccess: (result, _variables, context) => {
            queryClient.setQueryData<StoryWithUser[]>(["stories"], (old) => [
                {
                    ...result.data,
                    user: result.data.user || { // Handle null user from API
                        id: initialToken.id,
                        username: initialToken.username,
                        photoUrl: initialToken.photoUrl,
                    },
                },
                ...(old || initialStories).filter((s) => s.id !== context!.tempId),
            ]);
            resetForm();
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(["stories"], context!.previousStories);
            setError("Failed to add story");
            resetForm();
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["stories"] });
        },
    });

    const resetForm = useCallback(() => {
        setImgPreview(null);
        setFile(null);
        setError(null);
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File too large (max 5MB)");
            return;
        }
        if (!["image/jpeg", "image/png", "image/gif"].includes(selectedFile.type)) {
            setError("Please select an image file (JPEG, PNG, GIF)");
            return;
        }

        const previewUrl = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setImgPreview(previewUrl);
        setError(null);
    }, []);

    const handleAddStory = useCallback(() => {
        if (!file || !authToken) {
            setError(!authToken ? "Please log in to add a story" : "No file selected");
            return;
        }
        addStoryMutation.mutate(file);
    }, [file, authToken, addStoryMutation]);

    const myStories = currentStories.filter((story) => story.userId === userId && !story.photoUrl.startsWith("blob:"));
    const otherStories = currentStories.filter((story) => story.userId !== userId && !story.photoUrl.startsWith("blob:"));
    const allStories = [...myStories, ...otherStories];

    const startStoryTimer: () => void = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(0);

        intervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(intervalRef.current!);
                    handleNextStory();
                    return 100;
                }
                return prev + (100 / (STORY_DURATION / 100));
            });
        }, 100);

        timerRef.current = setTimeout(() => {
            handleNextStory();
        }, STORY_DURATION);
    }, [selectedStoryIndex, allStories]);

    const handleNextStory: () => void = useCallback(() => {
        if (selectedStoryIndex === null || selectedStoryIndex >= allStories.length - 1) {
            setSelectedStoryIndex(null);
        } else {
            setSelectedStoryIndex(selectedStoryIndex + 1);
            startStoryTimer();
        }
    }, [selectedStoryIndex, allStories, startStoryTimer]);

    const handlePrevStory: () => void = useCallback(() => {
        if (selectedStoryIndex === null || selectedStoryIndex <= 0) {
            setSelectedStoryIndex(null);
        } else {
            setSelectedStoryIndex(selectedStoryIndex - 1);
            startStoryTimer();
        }
    }, [selectedStoryIndex, startStoryTimer]);

    const handleClosePreview: () => void = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setSelectedStoryIndex(null);
        setProgress(0);
    }, []);

    const handleStoryClick: (index: number) => void = useCallback((index) => {
        setSelectedStoryIndex(index);
        startStoryTimer();
    }, [startStoryTimer]);

    if (isLoading) {
        return <div>Loading stories...</div>;
    }

    return (
        <>
            <div className="flex items-center gap-6 p-4 overflow-x-auto scrollbar-hide">
                <div className="flex flex-col items-center gap-2 group">
                    <label
                        htmlFor="story-upload"
                        className="relative cursor-pointer transition-transform group-hover:scale-105"
                        onClick={myStories.length > 0 ? () => handleStoryClick(0) : undefined}
                    >
                        <Image
                            src={
                                imgPreview ||
                                (myStories.length > 0
                                    ? myStories[0].photoUrl
                                    : initialToken.photoUrl
                                    ? getFullURL(initialToken.photoUrl)
                                    : "/assets/egg.jpg")
                            }
                            alt="Your Story"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover ring-2 ring-[var(--hover)] shadow-md"
                            priority={imgPreview !== null}
                        />
                        {!imgPreview && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </label>
                    <input
                        id="story-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {imgPreview ? (
                        <button
                            onClick={handleAddStory}
                            disabled={addStoryMutation.isPending || !authToken}
                            className="px-3 py-1 text-sm font-medium text-white bg-[var(--blue)] rounded-full hover:bg-[var(--hover-blue)] disabled:bg-[var(--blue)]/70 disabled:cursor-not-allowed transition-colors"
                        >
                            {addStoryMutation.isPending ? "Uploading..." : "Post Story"}
                        </button>
                    ) : (
                        <span className="text-sm font-medium text-muted">Your Story</span>
                    )}
                    {error && (
                        <span className="text-xs text-[var(--red)] font-medium bg-red-50 px-2 py-1 rounded animate-in fade-in">
                            {error}
                        </span>
                    )}
                </div>

                {otherStories.map((story, index) => (
                    <div
                        key={story.id}
                        className="flex flex-col items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                        onClick={() => handleStoryClick(myStories.length + index)}
                    >
                        <Image
                            src={story.photoUrl || "/assets/egg.jpg"}
                            alt={story.user?.username || "Unknown"}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover ring-2 ring-[var(--blue)] shadow-md"
                        />
                        <span className="text-sm font-medium text-muted truncate max-w-[80px]">
                            {story.user?.username || "Unknown"}
                        </span>
                    </div>
                ))}
            </div>

            {selectedStoryIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <button
                        onClick={handleClosePreview}
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                        aria-label="Close story preview"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="absolute top-2 left-0 right-0 flex gap-1 px-4">
                        {allStories.map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
                            >
                                <div
                                    className="h-full bg-white transition-all duration-100 ease-linear"
                                    style={{
                                        width:
                                            i < selectedStoryIndex
                                                ? "100%"
                                                : i === selectedStoryIndex
                                                ? `${progress}%`
                                                : "0%",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <div
                        className="w-full h-full flex items-center justify-center"
                        onClick={(e) => {
                            const clickX = e.clientX;
                            const screenWidth = window.innerWidth;
                            clickX < screenWidth / 2 ? handlePrevStory() : handleNextStory();
                        }}
                    >
                        <Image
                            src={allStories[selectedStoryIndex].photoUrl || "/assets/egg.jpg"}
                            alt={allStories[selectedStoryIndex].user?.username || "Unknown"}
                            width={1080}
                            height={1920}
                            className="max-w-full max-h-full object-contain"
                            priority
                        />
                        <div className="absolute bottom-4 text-white text-center">
                            <span className="font-medium">
                                {allStories[selectedStoryIndex].user?.username || "Unknown"}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Stories;