"use client";

import { useState } from "react";
import { FiShare, FiCopy, FiMail } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";

export default function Share({ tweetUrl }: { tweetUrl: string }) {
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    message: "",
    severity: "success",
    open: false,
  });

  const openWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tweetUrl);
    setSnackbar({
      message: "Link copied to clipboard!",
      severity: "success",
      open: true,
    });
  };

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    tweetUrl
  )}`;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    tweetUrl
  )}`;
  const linkedinShare = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    tweetUrl
  )}`;
  const emailShare = `mailto:?subject=Check this out&body=${encodeURIComponent(
    tweetUrl
  )}`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="icon share">
            <FiShare className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          className="w-44 p-1 rounded-xl bg-[var(--background-secondary)] shadow-lg border border-solid border-[var(--border)]"
        >
          <DropdownMenuItem
            onClick={() => openWindow(facebookShare)}
            className="flex items-center gap-2"
          >
            <FaFacebook className="text-blue-600" />
            Facebook
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => openWindow(twitterShare)}
            className="flex items-center gap-2"
          >
            <FaTwitter className="text-sky-500" />
            X (Twitter)
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => openWindow(linkedinShare)}
            className="flex items-center gap-2"
          >
            <FaLinkedin className="text-blue-700" />
            LinkedIn
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => openWindow(emailShare)}
            className="flex items-center gap-2"
          >
            <FiMail className="text-green-600" />
            Email
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <FiCopy className="text-purple-600" />
            Copy link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
