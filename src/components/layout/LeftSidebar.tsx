"use client";

import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { FaEllipsisH} from "react-icons/fa";

import NewPostDialog from "../dialog/NewPostDialog";
import LogOutDialog from "../dialog/LogOutDialog";
import { logout } from "@/utilities/fetch";
import { AuthContext } from "@/app/(vicsory)/layout";
import { getFullURL } from "@/utilities/misc/getFullURL";
import UnreadNotificationsBadge from "../misc/UnreadNotificationsBadge";


import Image from "next/image";
import { HomeFill, HomeOutline } from "../../../public/svg/home";
import { ExploreFill, ExploreOutline } from "../../../public/svg/explore";
import { SchoolFill, SchoolOutline } from "../../../public/svg/school";
import { BusinessFill, BusinessOutline } from "../../../public/svg/business";
import { NotificationFill, NotificationOutline } from "../../../public/svg/notification";
import { ChatFill, ChatOutline } from "../../../public/svg/chat";
import { ProfileFill } from "../../../public/svg/profile";
import { SettingFill, SettingOutline } from "../../../public/svg/setting";
import { Separator } from "../ui/separator";
import { BadgeCheck, Plus } from "lucide-react";

export default function LeftSidebar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isNewPostOpen, setIsNewPostOpen] = useState(false);
    const [isLogOutOpen, setIsLogOutOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { token } = useContext(AuthContext);

    const router = useRouter();
    const pathname = usePathname();

    // Maximum character limits
    const MAX_NAME_LENGTH = 10;
    const MAX_USERNAME_LENGTH = 10;

    // Truncate function
    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }
        return text;
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        router.push("/");
    };

    const handleAnchorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleAnchorClose = () => {
        setAnchorEl(null);
    };
    const handleNewPostClick = () => {
        setIsNewPostOpen(true);
    };
    const handleNewPostClose = () => {
        setIsNewPostOpen(false);
    };
    const handleLogOutClick = () => {
        handleAnchorClose();
        setIsLogOutOpen(true);
    };
    const handleLogOutClose = () => {
        setIsLogOutOpen(false);
    };

    return (
        <>
            <aside className={`md:block hidden relative ml-auto ${isCollapsed ? "min-w-[80px]" : "min-w-[230px]"} pl-4 pr-4 pt-6 h-full`}>
                <div className="fixed h-full flex flex-col gap-8">
                    <Link href="/explore" className="w-fit pl-2 group">
                        <div className="relative w-8 h-8 md:w-10 md:h-10">
                            <Image
                                className="object-contain transition-transform duration-200 group-hover:scale-110"
                                alt="Vicsory logo"
                                src="/assets/favicon.png"
                                fill
                                sizes="(max-width: 768px) 32px, 40px"
                                priority
                            />
                        </div>
                    </Link>
                    <nav>
                        <ul className="text-lg flex flex-col gap-2">
                            {token && (
                                <li>
                                    <Link
                                        href="/home"
                                        className="flex px-3 py-2 rounded-full transition-colors duration-200 hover:bg-[var(--hover)]"
                                    >
                                        <div
                                            className={`inline-flex items-center ${pathname.startsWith("/home") ? "font-black" : ""}`}
                                        >
                                            {pathname.startsWith("/home") ? (
                                                <HomeFill className={`mr-4 ${pathname.startsWith("/home") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            ) : (
                                                <HomeOutline className={`mr-4 ${pathname.startsWith("/home") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            )}
                                            {!isCollapsed && <span>Home</span>}
                                        </div>
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link href="/explore" className="flex px-3 py-2 rounded-full transition-colors duration-200 hover:bg-[var(--hover)]">
                                    <div className={`inline-flex items-center ${pathname.startsWith("/explore") ? "font-black" : ""}`}>
                                        <div className="relative">
                                            {pathname.startsWith("/explore") ? (
                                                <ExploreFill className={`mr-4 ${pathname.startsWith("/explore") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            ) : (
                                                <ExploreOutline className={`mr-4 ${pathname.startsWith("/explore") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            )}
                                        </div>
                                        {!isCollapsed && <span>Explore</span>}
                                    </div>
                                </Link>
                            </li>
                            <Separator />
                            <li>
                                <Link href="/school" className="flex px-3 py-2 rounded-full transition-colors duration-200 hover:bg-[var(--hover)]">
                                    <div className={`inline-flex items-center ${pathname.startsWith("/school") ? "font-black" : ""}`}>
                                        <div className="relative">
                                            {pathname.startsWith("/school") ? (
                                                <SchoolFill className={`mr-4 ${pathname.startsWith("/school") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            ) : (
                                                <SchoolOutline className={`mr-4 ${pathname.startsWith("/school") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            )}
                                        </div>
                                        {!isCollapsed && <span>Schools</span>}
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/business" className="flex px-3 py-2 rounded-full transition-colors duration-200 hover:bg-[var(--hover)]">
                                    <div className={`inline-flex items-center ${pathname.startsWith("/business") ? "font-black" : ""}`}>
                                        <div className="relative">
                                            {pathname.startsWith("/business") ? (
                                                <BusinessFill className={`mr-4 ${pathname.startsWith("/business") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            ) : (
                                                <BusinessOutline className={`mr-4 ${pathname.startsWith("/business") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            )}
                                        </div>
                                        {!isCollapsed && <span>Jobs</span>}
                                    </div>
                                </Link>
                            </li>
                            <Separator />
                            {token && (
                                <>
                                    <li>
                                        <Link href="/notifications" className="flex px-3 py-2 rounded-full transition-colors duration-200 hover:bg-[var(--hover)]">
                                            <div className={`inline-flex items-center ${pathname.startsWith("/notifications") ? "font-black" : ""}`}>
                                                <div className="relative">
                                                    {pathname.startsWith("/notifications") ? (
                                                        <NotificationFill className={`mr-4 ${pathname.startsWith("/notifications") ? "w-6 h-6" : "w-6 h-6"}`} />
                                                    ) : (
                                                        <NotificationOutline className={`mr-4 ${pathname.startsWith("/notifications") ? "w-6 h-6" : "w-6 h-6"}`} />
                                                    )}
                                                    <UnreadNotificationsBadge />
                                                </div>
                                                {!isCollapsed && <span>Notifications</span>}
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/messages" className="flex px-3 py-2 rounded-full transition-colors duration-200 hover:bg-[var(--hover)]">
                                            <div className={`inline-flex items-center ${pathname.startsWith("/messages") ? "font-black" : ""}`}>
                                                <div className="relative">
                                                    {pathname.startsWith("/messages") ? (
                                                        <ChatFill className={`mr-4 ${pathname.startsWith("/messages") ? "w-6 h-6" : "w-6 h-6"}`} />
                                                    ) : (
                                                        <ChatOutline className={`mr-4 ${pathname.startsWith("/messages") ? "w-6 h-6" : "w-6 h-6"}`} />
                                                    )}
                                                </div>
                                                {!isCollapsed && <span>Chat</span>}
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/${token.username}`} className="flex px-3 py-2 rounded-full transition-colors duration-200 hover:bg-[var(--hover)]">
                                            <div className={`inline-flex items-center ${pathname.startsWith(`/${token.username}`) ? "font-black" : ""}`}>
                                                <div className="relative">
                                                    {pathname.startsWith(`/${token.username}`) ? (
                                                        <ProfileFill className={`mr-4 ${pathname.startsWith(`/${token.username}`) ? "w-6 h-6" : "w-6 h-6"}`} />
                                                    ) : (
                                                        <ProfileFill className={`mr-4 ${pathname.startsWith(`/${token.username}`) ? "w-6 h-6" : "w-6 h-6"}`} />
                                                    )}
                                                </div>
                                                {!isCollapsed && <span>Profile</span>}
                                            </div>
                                        </Link>
                                    </li>
                                </>
                            )}
                            <Separator />
                            <li>
                                <Link href="/settings" className="flex px-3 py-2 rounded-full transition-colors duration-200 hover:bg-[var(--hover)]">
                                    <div className={`inline-flex items-center ${pathname.startsWith("/settings") ? "font-black" : ""}`}>
                                        <div className="relative">
                                            {pathname.startsWith("/settings") ? (
                                                <SettingFill className={`mr-4 ${pathname.startsWith("/settings") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            ) : (
                                                <SettingOutline className={`mr-4 ${pathname.startsWith("/settings") ? "w-6 h-6" : "w-6 h-6"}`} />
                                            )}
                                        </div>
                                        {!isCollapsed && <span>Settings</span>}
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    {token && (
                        <>
                            <button onClick={handleNewPostClick} className="flex items-center justify-center gap-2 py-2 rounded-full font-bold bg-[var(--blue)] hover:bg-[var(--hover-blue)] text-white">
                                <Plus className="h-6 w-6" />
                                {!isCollapsed && "Post"}
                            </button>
                            <button onClick={handleAnchorClick} className="fixed bottom-6 flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-500/10 max-w-[250px] overflow-hidden border border-[var(--border-color)] border-solid">
                                <Avatar
                                    className="w-10 h-10"
                                    alt=""
                                    src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"}
                                />
                                {!isCollapsed && (
                                    <div className="flex-1 items-center">
                                        <div className="font-bold pb-1 text-left flex items-center">
                                            {truncateText(token.name && token.name !== "" ? token.name : token.username || "", MAX_NAME_LENGTH)}
                                            {token.isPremium && (
                                                <span className="ml-1 w-4 h-4 flex items-center text-[var(--blue)]">
                                                    <BadgeCheck fill="#1E90FE" stroke="#fff"/>
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted text-left">
                                            @{truncateText(token.username || "", MAX_USERNAME_LENGTH)}
                                        </div>
                                    </div>
                                )}
                                {!isCollapsed && (
                                    <div className="pr-2 text-[var(--active-mode)]">
                                        <FaEllipsisH />
                                    </div>
                                )}
                            </button>
                            <Menu
                                anchorEl={anchorEl}
                                onClose={handleAnchorClose}
                                open={Boolean(anchorEl)}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                            >
                                <MenuItem onClick={handleAnchorClose}>
                                    <Link href={`/${token.username}`}>Profile</Link>
                                </MenuItem>
                                <MenuItem onClick={handleAnchorClose}>
                                    <Link href={`/${token.username}/edit`}>Edit Profile</Link>
                                </MenuItem>
                                <MenuItem onClick={handleAnchorClose}>
                                    <Link href="/settings">Settings</Link>
                                </MenuItem>
                                <MenuItem onClick={handleLogOutClick}>Log Out</MenuItem>
                            </Menu>
                        </>
                    )}
                </div>
            </aside>
            {token && (
                <>
                    <NewPostDialog open={isNewPostOpen} handleNewPostClose={handleNewPostClose} token={token} />
                    <LogOutDialog
                        open={isLogOutOpen}
                        handleLogOutClose={handleLogOutClose}
                        logout={handleLogout}
                        isLoggingOut={isLoggingOut}
                    />
                </>
            )}
        </>
    );
}