"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegComment, FaRegEnvelope } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { RiChatFollowUpLine, RiRepeatLine } from "react-icons/ri";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"; // shadcn/ui components
import { NotificationProps } from "@/types/NotificationProps";
import { getFullURL } from "@/utilities/misc/getFullURL";
import ProfileCard from "../user/ProfileCard";
import { UserProps } from "@/types/UserProps";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function Notification({ notification, token }: { notification: NotificationProps; token: UserProps }) {
  const [open, setOpen] = useState(false);

  const content = JSON.parse(notification.content);
  const postUrl = `/${notification.user.username}/posts/${content?.content?.id}`;
  const profileUrl = `/${content?.sender.username}`;

  const senderAvatar = (
    <Avatar className="w-8 h-8">
      <AvatarImage src={content?.sender.photoUrl ? getFullURL(content?.sender.photoUrl) : "/assets/egg.jpg"} />
      <AvatarFallback>{content?.sender.username?.[0]}</AvatarFallback>
    </Avatar>
  );

  const sharedJSX = (
    <div className="flex items-center gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Link
            href={profileUrl}
            className="flex items-center gap-2 hover:underline"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {senderAvatar}
            <div className="flex flex-col">
              <span className="font-semibold">
                {content?.sender.name || content?.sender.username}
              </span>
              <span className="text-[var(--muted)] text-sm">
                @{content?.sender.username}
              </span>
            </div>
          </Link>
        </PopoverTrigger>
        <PopoverContent className="w-80 border border-solid border-[var(--border-color)] bg-[var(--background)]">
          <ProfileCard username={content?.sender.username} token={token} />
        </PopoverContent>
      </Popover>
    </div>
  );

  const notificationStyles = "flex items-start gap-3 p-4 border border-solid border-[var(--border-color)] bg-[var(--background)] hover:bg-[var(--hover)]";

  if (notification.type === "message") {
    return (
      <div className={notificationStyles}>
        <div className="text-[var(--blue)]">
          <FaRegEnvelope size={20} />
        </div>
        <div className="flex-1">
          {sharedJSX}
          <span className={`ml-2 ${!notification.isRead ? "font-bold" : ""}`}>
            Sent you a direct message.
          </span>{" "}
          <Link href="/messages" className={`text-[var(--blue)] hover:underline ${!notification.isRead ? "font-bold" : ""}`}>
            Check it out!
          </Link>
        </div>
      </div>
    );
  } else if (notification.type === "follow") {
    return (
      <div className={notificationStyles}>
        <div className="text-[var(--green)]">
          <RiChatFollowUpLine size={20} />
        </div>
        <div className="flex-1">
          {sharedJSX}
          <span className={`ml-2 ${!notification.isRead ? "font-bold" : ""}`}>
            Started following you. Stay connected and discover their updates!
          </span>
        </div>
      </div>
    );
  } else if (notification.type === "like") {
    return (
      <div className={notificationStyles}>
        <div className="text-[var(--red)]">
          <FaHeart size={20} />
        </div>
        <div className="flex-1">
          {sharedJSX}
          <span className={`ml-2 ${!notification.isRead ? "font-bold" : ""}`}>
            Liked your
          </span>{" "}
          <Link href={postUrl} className={`text-[var(--blue)] hover:underline ${!notification.isRead ? "font-bold" : ""}`}>
            post.
          </Link>
        </div>
      </div>
    );
  } else if (notification.type === "reply") {
    return (
      <div className={notificationStyles}>
        <div className="text-[var(--gray)]">
          <FaRegComment size={20} />
        </div>
        <div className="flex-1">
          {sharedJSX}
          <span className={`ml-2 ${!notification.isRead ? "font-bold" : ""}`}>
            Replied to your
          </span>{" "}
          <Link href={postUrl} className={`text-[var(--blue)] hover:underline ${!notification.isRead ? "font-bold" : ""}`}>
            post.
          </Link>
        </div>
      </div>
    );
  } else if (notification.type === "repost") {
    return (
      <div className={notificationStyles}>
        <div className="text-[var(--orange)]">
          <RiRepeatLine size={20} />
        </div>
        <div className="flex-1">
          {sharedJSX}
          <span className={`ml-2 ${!notification.isRead ? "font-bold" : ""}`}>
            Reposted your
          </span>{" "}
          <Link href={postUrl} className={`text-[var(--blue)] hover:underline ${!notification.isRead ? "font-bold" : ""}`}>
            post.
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className={notificationStyles}>
        <div className="text-[var(--orange)]">
          <GiPartyPopper size={20} />
        </div>
        <div className={`flex-1 ${!notification.isRead ? "font-bold" : "text-muted"}`}>
          Welcome to Vicsory! <br />
          Start exploring and sharing your thoughts with the world.
        </div>
      </div>
    );
  }
}