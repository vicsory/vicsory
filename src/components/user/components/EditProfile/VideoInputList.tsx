// VideoInputList.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaYoutube } from "react-icons/fa";
import { X } from "lucide-react";
import Link from "next/link";

interface Video {
  url: string;
  title: string;
}

interface VideoInputListProps {
  videos: Video[];
  setFieldValue: (field: string, value: any) => void;
  errors?: string[];
  touched?: boolean[];
  isPremium: boolean;
}

export default function VideoInputList({ videos, setFieldValue, errors, touched, isPremium }: VideoInputListProps) {
  const [videoInputs, setVideoInputs] = useState<Video[]>(videos.length > 0 ? videos : [{ url: "", title: "" }]);

  const handleAddVideo = () => {
    if (isPremium && videoInputs.length < 5) {
      // Premium users can add up to 5 videos
      setVideoInputs([...videoInputs, { url: "", title: "" }]);
    } else if (!isPremium && videoInputs.length < 1) {
      // Non-premium users can add only 1 video
      setVideoInputs([...videoInputs, { url: "", title: "" }]);
    }
    // No action if limit is reached (1 for non-premium, 5 for premium)
  };

  const handleRemoveVideo = (index: number) => {
    const newVideos = videoInputs.filter((_, i) => i !== index);
    setVideoInputs(newVideos);
    setFieldValue("youtubePlayerUrls", newVideos);
  };

  const handleVideoChange = (index: number, field: "url" | "title", value: string) => {
    const newVideos = [...videoInputs];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setVideoInputs(newVideos);
    setFieldValue("youtubePlayerUrls", newVideos);
  };

  // Determine if "Add Another Video" button should be shown/disabled
  const maxVideosReached = isPremium ? videoInputs.length >= 5 : videoInputs.length >= 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start">
        <h3 className="text-lg text-[var(--text)] font-semibold flex items-center gap-2">
          <FaYoutube size={20}/>
          Additional YouTube Videos
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          {isPremium ? "Up to 5 videos for premium users" : "1 video (up to 5 for premium users)"}
        </p>
      </div>

      {videoInputs.map((video, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="YouTube Video URL"
              value={video.url}
              onChange={(e) => handleVideoChange(index, "url", e.target.value)}
              className={`flex-1 bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${
                touched?.[index] && errors?.[index] ? "border-[var(--red)]" : ""
              }`}
            />
            {videoInputs.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveVideo(index)}
                className="hover:bg-[var(--background-secondary)]"
              >
                <X size={20} />
              </Button>
            )}
          </div>
          <Input
            placeholder="Video Title"
            value={video.title}
            onChange={(e) => handleVideoChange(index, "title", e.target.value)}
            className="bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2"
          />
          {touched?.[index] && errors?.[index] && (
            <p className="text-[var(--red)] text-sm">{errors[index]}</p>
          )}
        </div>
      ))}

      {!maxVideosReached && (
        <Button
          variant="outline"
          onClick={handleAddVideo}
          className="w-full border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)]"
        >
          Add Another Video
        </Button>
      )}
      {maxVideosReached && !isPremium && (
        <p className="text-sm text-[var(--text)]">
          Want to add more videos?{" "}
          <Link href="/verify" className="text-[var(--blue)] hover:underline">
            Upgrade to premium
          </Link>{" "}
          for up to 5 videos.
        </p>
      )}
    </div>
  );
}