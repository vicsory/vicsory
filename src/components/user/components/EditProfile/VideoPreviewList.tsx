// VideoPreviewList.tsx
import { FaYoutube } from "react-icons/fa";
import { Play } from "lucide-react";

interface Video {
  url: string;
  title: string;
}

interface VideoPreviewListProps {
  videos: Video[];
  setPreviewUrl: (url: string) => void;
  setIsPlaying: (playing: boolean) => void;
}

export default function VideoPreviewList({ videos, setPreviewUrl, setIsPlaying }: VideoPreviewListProps) {
  const getThumbnailUrl = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      let videoId = "";
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.split("/")[1];
      }
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    } catch {
      return "/assets/placeholder.jpg";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FaYoutube size={20} color="var(--active-mode)" />
        Video Previews
      </h3>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((video, index) => (
            <div
              key={index}
              className="relative cursor-pointer group"
              onClick={() => {
                setPreviewUrl(video.url);
                setIsPlaying(true);
              }}
            >
              <img
                src={getThumbnailUrl(video.url)}
                alt={video.title}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={24} color="white" />
              </div>
              <p className="mt-1 text-sm truncate">{video.title || "Untitled Video"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No videos added yet.</p>
      )}
    </div>
  );
}