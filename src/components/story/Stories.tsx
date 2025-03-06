"use client";

import { addStory } from "@/utilities/fetch";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProps } from "@/types/UserProps";
import { upload } from "@/lib/uploadcare";
import { Plus } from "lucide-react";

type StoryWithUser = {
  id: number;
  img: string;
  createdAt: Date;
  expiresAt: Date;
  userId: string;
  user: UserProps;
};

interface StoriesProps {
  stories: StoryWithUser[];
  userId: string;
  token: UserProps;
}

const Stories = ({ stories, userId, token }: StoriesProps) => {
  const queryClient = useQueryClient();
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addStoryMutation = useMutation({
    mutationFn: async (file: File) => {
      const uploadResult = await upload.uploadFile(file);
      const imgUrl = `https://ucarecdn.com/${uploadResult.uuid}/`;
      return addStory(imgUrl);
    },
    onMutate: async (file) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["stories"] });

      // Snapshot of previous state for rollback
      const previousStories = queryClient.getQueryData<StoryWithUser[]>(["stories"]) || [];

      // Create optimistic story
      const imgUrl = URL.createObjectURL(file);
      const optimisticStory: StoryWithUser = {
        id: Math.random(), // Temporary ID
        img: imgUrl,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId,
        user: token,
      };

      // Optimistically update query data
      queryClient.setQueryData<StoryWithUser[]>(["stories"], (old) => [optimisticStory, ...(old || [])]);

      // Return context for rollback or cleanup
      return { previousStories, imgUrl };
    },
    onSuccess: (createdStory, _variables, context) => {
      // Clean up temporary URL
      URL.revokeObjectURL(context!.imgUrl);

      // Replace optimistic story with real data
      queryClient.setQueryData<StoryWithUser[]>(["stories"], (old) =>
        old ? [createdStory, ...old.filter((s) => s.id !== context!.previousStories[0]?.id)] : [createdStory]
      );

      // Reset form
      setImgPreview(null);
      setFile(null);
      setError(null);
    },
    onError: (_error, _variables, context) => {
      // Rollback to previous state on error
      URL.revokeObjectURL(context!.imgUrl);
      queryClient.setQueryData(["stories"], context!.previousStories);

      // Reset form and show error
      setImgPreview(null);
      setFile(null);
      setError("Failed to add story");
    },
    onSettled: () => {
      // Optional: Invalidate to refetch fresh data if needed
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File too large (max 5MB)");
        return;
      }
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setFile(selectedFile);
      setImgPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleAddStory = () => {
    if (!file) return;
    addStoryMutation.mutate(file);
  };

  const currentStories = queryClient.getQueryData<StoryWithUser[]>(["stories"]) || stories;

  return (
    <div className="flex items-center gap-6 p-4 overflow-x-auto scrollbar-hide">
      {/* Add Story Section */}
      <div className="flex flex-col items-center gap-2 group">
        <label 
          htmlFor="story-upload"
          className="relative cursor-pointer transition-transform group-hover:scale-105"
        >
          <Image
            src={imgPreview || token.photoUrl || "/assets/egg.jpg"}
            alt="Add story"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-[var(--hover)] shadow-md"
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
            disabled={addStoryMutation.isPending}
            className="px-3 py-1 text-sm font-medium text-white bg-[var(--blue)] rounded-full hover:bg-[var(--hover-blue)] disabled:bg-[var(--blue)] disabled:cursor-not-allowed transition-colors"
          >
            {addStoryMutation.isPending ? "Sending..." : "Post Story"}
          </button>
        ) : (
          <span className="text-sm font-medium text-muted">Your Story</span>
        )}
        {error && (
          <span className="text-xs text-[var(--red)] font-medium bg-red-50 px-2 py-1 rounded">
            {error}
          </span>
        )}
      </div>

      {/* Existing Stories */}
      {currentStories.map((story) => (
        <div 
          key={story.id}
          className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
        >
          <Image
            src={story.img}
            alt={story.user.username}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-[var(--blue)] shadow-md"
          />
          <span className="text-sm font-medium text-muted truncate max-w-[80px]">
            {story.user.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stories;