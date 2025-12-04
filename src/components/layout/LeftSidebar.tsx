"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Plus,
    User,
    Edit,
    Settings,
    LogOut,
    MoreHorizontal,
    LogIn,
} from "lucide-react";

import { BadgeBlue } from "../../../public/svg/verify-badge";
import NewTweet from "../tweet/NewTweet";
import LogInDialog from "../dialog/LogInDialog";
import LogOutDialog from "../dialog/LogOutDialog";
import { logout } from "@/utilities/fetch";
import { getFullURL } from "@/utilities/misc/getFullURL";
import UnreadNotificationsBadge from "../misc/UnreadNotificationsBadge";
import { BusinessFill, BusinessOutline } from "../../../public/svg/business";
import { ChatFill, ChatOutline } from "../../../public/svg/chat";
import { HomeFill, HomeOutline } from "../../../public/svg/home";
import { NotificationFill, NotificationOutline } from "../../../public/svg/notification";
import { ProfileFill, ProfileOutline } from "../../../public/svg/profile";
import { SchoolFill, SchoolOutline } from "../../../public/svg/school";
import { SettingFill, SettingOutline } from "../../../public/svg/setting";
import { AuthContext } from "@/contexts/auth-context";

// Reusable classNames
const linkBase = "flex px-3 py-2 rounded-full hover:bg-[var(--background-secondary)] cursor-pointer";
const dropdownItemBase = "px-4 py-2 rounded-lg hover:bg-[var(--background-secondary)] cursor-pointer";

// Reusable NavIcon component
interface NavIconProps {
    href: string;
    label: string;
    IconFill: React.ComponentType<any>;
    IconOutline: React.ComponentType<any>;
    pathname: string;
    children?: React.ReactNode; // optional badges or extras
}

const NavIcon = ({ href, label, IconFill, IconOutline, pathname, children }: NavIconProps) => {
    const isActive = pathname.startsWith(href);

    return (
        <Link href={href} className={linkBase}>
            <div className={`inline-flex items-center ${isActive ? "text-[var(--text)]" : "text-[var(--text-secondary)]"}`}>
                {isActive ? <IconFill className="w-6 h-6 mr-4" /> : <IconOutline className="w-6 h-6 mr-4" />}
                <span>{label}</span>
                {children && <>{children}</>}
            </div>
        </Link>
    );
};

export default function LeftSidebar({ className = "" }: { className?: string }) {
    const [isNewPostOpen, setIsNewPostOpen] = useState(false);
    const [isLogOutOpen, setIsLogOutOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isLogInOpen, setIsLogInOpen] = useState(false);

    const { token } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();

    const MAX_NAME_LENGTH = 10;
    const MAX_USERNAME_LENGTH = 10;

    const truncateText = (text: string, maxLength: number) =>
        text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        router.push("/");
    };

    const navItems = [
        { href: "/home", label: "Home", iconFill: HomeFill, iconOutline: HomeOutline, show: !!token },
        { href: "/school", label: "Courses", iconFill: SchoolFill, iconOutline: SchoolOutline, show: true },
        { href: "/jobs", label: "Business", iconFill: BusinessFill, iconOutline: BusinessOutline, show: true },
        { href: "/notifications", label: "Notifications", iconFill: NotificationFill, iconOutline: NotificationOutline, show: !!token, badge: <UnreadNotificationsBadge /> },
        { href: "/messages", label: "Chat", iconFill: ChatFill, iconOutline: ChatOutline, show: !!token },
        { href: token ? `/${token.username}` : "#", label: "Profile", iconFill: ProfileFill, iconOutline: ProfileOutline, show: !!token },
        { href: "/settings", label: "Settings", iconFill: SettingFill, iconOutline: SettingOutline, show: true },
    ];

    return (
        <>
            <aside className="hidden xl:flex flex-col flex-shrink-0 px-4 z-50 fixed top-16 h-[calc(100vh-4rem)]">
                <div className="h-full flex flex-col gap-6">
                    <nav>
                        <ul className="flex flex-col gap-2 text-lg">
                            {navItems.map(({ href, label, iconFill, iconOutline, show, badge }) => {
                                if (!show) return null;
                                return (
                                    <li key={label}>
                                        <NavIcon
                                            href={href}
                                            label={label}
                                            IconFill={iconFill}
                                            IconOutline={iconOutline}
                                            pathname={pathname}
                                        >
                                            {badge}
                                        </NavIcon>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {token && (
                        <>
                            <Button
                                onClick={() => setIsNewPostOpen(true)}
                                className="text-lg w-fit text-center text-[var(--text)] hover:text-[var(--text-secondary)] mt-4 py-2 px-4 border border-solid border-[var(--border)] rounded-full flex items-center gap-2 hover:bg-[var(--background-secondary)] transition-colors duration-200"
                            >
                                <Plus />
                                Post
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="fixed bottom-6 flex items-center gap-3 rounded-full border border-solid border-[var(--border)] bg-[var(--background-primary)] w-fit px-4 py-3">
                                        <Avatar className="w-10 h-10 border-2 border-solid border-[var(--border)] rounded-full">
                                            <AvatarImage src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"} alt="" />
                                            <AvatarFallback>{token.username?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-[var(--text)] truncate flex items-center">
                                                {truncateText(token.name || token.username || "", MAX_NAME_LENGTH)}
                                                {token.isPremium && <BadgeBlue className="ml-2 w-4 h-4" />}
                                            </div>
                                            <div className="text-sm text-[var(--text-secondary)] truncate">
                                                @{truncateText(token.username || "", MAX_USERNAME_LENGTH)}
                                            </div>
                                        </div>
                                        <MoreHorizontal className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="min-w-[200px] p-4 bg-[var(--background-primary)] border border-[var(--border)] rounded-xl z-50 text-[var(--text-secondary)]">
                                    <DropdownMenuItem asChild className={dropdownItemBase}><Link href={`/${token.username}`} className="flex items-center gap-3"><User className="w-5 h-5" />Profile</Link></DropdownMenuItem>
                                    <DropdownMenuItem asChild className={dropdownItemBase}><Link href={`/${token.username}/edit`} className="flex items-center gap-3"><Edit className="w-5 h-5" />Edit Profile</Link></DropdownMenuItem>
                                    <DropdownMenuItem asChild className={dropdownItemBase}><Link href="/settings" className="flex items-center gap-3"><Settings className="w-5 h-5" />Settings</Link></DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsLogOutOpen(true)} className={`${dropdownItemBase} flex items-center gap-3`}><LogOut className="w-5 h-5" />Log Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}

                    {!token && (
                        <Button onClick={() => setIsLogInOpen(true)} className="fixed bottom-6 text-lg text-center py-2 px-4 border border-solid border-[var(--border)] rounded-full text-[var(--text)] hover:text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] transition-colors duration-200 flex items-center gap-2">
                            <LogIn />
                            Log In
                        </Button>
                    )}

                    <LogInDialog open={isLogInOpen} handleLogInClose={() => setIsLogInOpen(false)} />
                </div>
            </aside>

            {token && (
                <>
                    <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                        <DialogTrigger asChild>
                            <Button className="hidden" />
                        </DialogTrigger>
                        <DialogContent className="max-w-lg bg-[var(--background-primary)]/70 backdrop-blur-md rounded-lg shadow-lg">
                            <DialogHeader>
                                <DialogTitle className="text-white">Create New Post</DialogTitle>
                            </DialogHeader>
                            <NewTweet token={token} handleSubmit={() => setIsNewPostOpen(false)} />
                        </DialogContent>
                    </Dialog>

                    <LogOutDialog open={isLogOutOpen} handleLogOutClose={() => setIsLogOutOpen(false)} logout={handleLogout} isLoggingOut={isLoggingOut} />
                </>
            )}
        </>
    );
}
