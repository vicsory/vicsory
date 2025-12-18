"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegComment, FaRegEnvelope } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { RiChatFollowUpLine } from "react-icons/ri";
import { Avatar, Popover } from "@mui/material";

import { NotificationProps } from "@/types/NotificationProps";
import { getFullURL } from "@/utilities/misc/getFullURL";
import ProfileCard from "../user/ProfileCard";
import { UserProps } from "@/types/UserProps";
import RepostIcon from "../../../public/svg/repost";

export default function Notification({ notification, token }: { notification: NotificationProps; token: UserProps }) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const content = JSON.parse(notification.content);

    const postUrl = `/${notification.user.username}/posts/${content?.content?.id}`;
    const profileUrl = `/${content?.sender.username}`;

    const popoverJSX = (
        <Popover
            sx={{
                pointerEvents: "none",
            }}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
        >
            <ProfileCard username={content?.sender.username} token={token} />
        </Popover>
    );

    const sharedJSX = (
        <div className="flex items-center gap-2">
            <Link
                href={profileUrl}
                className="flex items-center gap-2"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <Avatar
                    sx={{ width: 33, height: 33 }}
                    alt=""
                    src={content?.sender.photoUrl ? getFullURL(content?.sender.photoUrl) : "/assets/egg.jpg"}
                />
                <div className="flex flex-col">
                    <h1 className="text-sm font-semibold text-[var(--text)] flex items-center gap-1">
                        {content?.sender.name !== "" ? content?.sender.name : content?.sender.username}{" "}
                        <span className="text-[var(--text)] text-xs">(@{content?.sender.username})</span>
                    </h1>
                </div>
            </Link>
            {popoverJSX}
        </div>
    );

    if (notification.type === "message") {
        return (
            <div className="flex items-start gap-3 p-3 border-b border-solid border-[var(--border)]">
                <div className="text-blue-500 text-xl">
                    <FaRegEnvelope />
                </div>
                <div className="text-sm text-[var(--text)]">
                    {sharedJSX}{" "}
                    <span className={!notification.isRead ? "text-[var(--text-secondary)]" : ""}>Sent you a direct message.</span>{" "}
                    <Link className={`text-blue-600 hover:underline ${!notification.isRead ? "text-[var(--text-secondary)]" : ""}`} href="/messages">
                        Check it out!
                    </Link>
                </div>
            </div>
        );
    } else if (notification.type === "follow") {
        return (
            <div className="flex items-start gap-3 p-3 border-b border-solid border-[var(--border)]">
                <div className="text-purple-500 text-xl">
                    <RiChatFollowUpLine />
                </div>
                <div className="text-sm text-[var(--text)]">
                    {sharedJSX}{" "}
                    <span className={!notification.isRead ? "text-[var(--text-secondary)]" : ""}>
                        Started following you. Stay connected and discover their updates!
                    </span>
                </div>
            </div>
        );
    } else if (notification.type === "like") {
        return (
            <div className="flex items-start gap-3 p-3 border-b border-solid border-[var(--border)]">
                <div className="text-red-500 text-xl">
                    <FaHeart />
                </div>
                <div className="text-sm text-[var(--text)]">
                    {sharedJSX} <span className={!notification.isRead ? "text-[var(--text-secondary)]" : ""}>Liked your</span>{" "}
                    <Link className={`text-blue-600 hover:underline ${!notification.isRead ? "text-[var(--text-secondary)]" : ""}`} href={postUrl}>
                        post.
                    </Link>
                </div>
            </div>
        );
    } else if (notification.type === "reply") {
        return (
            <div className="fflex items-start gap-3 p-3 border-b border-solid border-[var(--border)]">
                <div className="text-green-600 text-xl">
                    <FaRegComment />
                </div>
                <div className="text-sm text-[var(--text)]">
                    {sharedJSX} <span className={!notification.isRead ? "text-[var(--text-secondary)]" : ""}>Replied to your</span>{" "}
                    <Link className={`text-blue-600 hover:underline ${!notification.isRead ? "text-[var(--text-secondary)]" : ""}`} href={postUrl}>
                        post.
                    </Link>
                </div>
            </div>
        );
    } else if (notification.type === "repost") {
        return (
            <div className="flex items-start gap-3 p-3 border-b border-solid border-[var(--border)]">
                <div className="text-yellow-500 text-xl">
                    <RepostIcon />
                </div>
                <div className="text-sm text-[var(--text)]">
                    {sharedJSX} <span className={!notification.isRead ? "text-[var(--text-secondary)]" : ""}>Reposted your</span>{" "}
                    <Link className={`text-blue-600 hover:underline ${!notification.isRead ? "text-[var(--text-secondary)]" : ""}`} href={postUrl}>
                        post.
                    </Link>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex items-start gap-3 p-3 border-b border-solid border-[var(--border)]">
                <div className="text-orange-500 text-xl">
                    <GiPartyPopper />
                </div>
                <div className={`text-base text-[var(--text)] ${!notification.isRead ? "text-[var(--text-secondary)]" : ""}`}>
                    Welcome to Vicsory! <br />
                    Share your ideas, expand your network, and unlock new opportunities.
                </div>
            </div>
        );
    }
}
