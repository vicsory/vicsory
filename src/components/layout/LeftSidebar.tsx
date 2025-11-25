"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Plus,
  User,
  Edit,
  Settings,
  LogOut,
  MoreHorizontal,
  LogIn,
} from "lucide-react";
import { logout } from "@/utilities/fetch";
import { AuthContext } from "@/app/(vicsory)/layout";
import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
import UnreadNotificationsBadge from "../misc/UnreadNotificationsBadge";
import { HomeFill, HomeOutline } from "../../../public/svg/home";
import { SchoolFill, SchoolOutline } from "../../../public/svg/school";
import { BusinessFill, BusinessOutline } from "../../../public/svg/business";
import { NotificationFill, NotificationOutline } from "../../../public/svg/notification";
import { ChatFill, ChatOutline } from "../../../public/svg/chat";
import { ProfileFill, ProfileOutline } from "../../../public/svg/profile";
import { SettingFill, SettingOutline } from "../../../public/svg/setting";
import { HashtagOutline } from "../../../public/svg/explore";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../public/svg/verify-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewPost from "../post/NewPost";
import LogInDialog from "../dialog/LogInDialog";
import LogOutDialog from "../dialog/LogOutDialog";


interface LeftSidebarProps {
  isTablet: boolean;
  className?: string;
}

export default function LeftSidebar({ isTablet, className = "" }: LeftSidebarProps) {
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { token } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const MAX_NAME_LENGTH = 10;
  const MAX_USERNAME_LENGTH = 10;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/");
  };

  const handleNewPostClick = () => {
    setIsNewPostOpen(true);
  };
  const handleLogOutClick = () => {
    setIsLogOutOpen(true);
  };
  const handleLogOutClose = () => {
    setIsLogOutOpen(false);
  };

  const [isLogInOpen, setIsLogInOpen] = useState(false);

  const openLogin = () => setIsLogInOpen(true);
  const closeLogin = () => setIsLogInOpen(false);

  const isIconsOnly = isTablet;
  const isHidden = false;

  if (isHidden) return null;

  return (
    <>
      <aside
        className={`fixed h-full ${isIconsOnly ? "w-20" : "w-[250px]"} px-4 py-4 z-50 bg-[var(--background-primary)] ${className}`}
      >
        <div className="h-full flex flex-col gap-6">
          <nav>
            <ul className="text-lg flex flex-col gap-2">
              {token && (
                <li>
                  <Link
                    href="/home"
                    className="flex px-3 py-2 rounded-full hover:bg-[var(--hover)]"
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className={`inline-flex items-center ${pathname.startsWith("/home") ? "font-black" : ""}`}
                    >
                      {pathname.startsWith("/home") ? (
                        <HomeFill className="w-6 h-6 mr-4 text-[var(--active-mode)]" />
                      ) : (
                        <HomeOutline className="w-6 h-6 mr-4 text-muted" />
                      )}
                      {!isIconsOnly && <span>Home</span>}
                    </div>
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/school"
                  className="flex px-3 py-2 rounded-full hover:bg-[var(--hover)]"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={`inline-flex items-center ${pathname.startsWith("/school") ? "font-black" : ""}`}
                  >
                    {pathname.startsWith("/school") ? (
                      <SchoolFill className="w-6 h-6 mr-4 text-[var(--active-mode)]" />
                    ) : (
                      <SchoolOutline className="w-6 h-6 mr-4 text-muted" />
                    )}
                    {!isIconsOnly && <span>Courses</span>}
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="flex px-3 py-2 rounded-full hover:bg-[var(--hover)]"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={`inline-flex items-center ${pathname.startsWith("/jobs") ? "font-black" : ""}`}
                  >
                    {pathname.startsWith("/jobs") ? (
                      <BusinessFill className="w-6 h-6 mr-4 text-[var(--active-mode)]" />
                    ) : (
                      <BusinessOutline className="w-6 h-6 mr-4 text-muted" />
                    )}
                    {!isIconsOnly && <span>Business</span>}
                  </div>
                </Link>
              </li>
              {token && (
                <>
                  <li>
                    <Link
                      href="/notifications"
                      className="flex px-3 py-2 rounded-full hover:bg-[var(--hover)]"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className={`inline-flex items-center ${pathname.startsWith("/notifications") ? "font-black" : ""}`}
                      >
                        <div className="relative">
                          {pathname.startsWith("/notifications") ? (
                            <NotificationFill className="w-6 h-6 mr-4 text-[var(--active-mode)]" />
                          ) : (
                            <NotificationOutline className="w-6 h-6 mr-4 text-muted" />
                          )}
                          <UnreadNotificationsBadge />
                        </div>
                        {!isIconsOnly && <span>Notifications</span>}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/messages"
                      className="flex px-3 py-2 rounded-full hover:bg-[var(--hover)]"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className={`inline-flex items-center ${pathname.startsWith("/messages") ? "font-black" : ""}`}
                      >
                        {pathname.startsWith("/messages") ? (
                          <ChatFill className="w-6 h-6 mr-4 text-[var(--active-mode)]" />
                        ) : (
                          <ChatOutline className="w-6 h-6 mr-4 text-muted" />
                        )}
                        {!isIconsOnly && <span>Chat</span>}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${token.username}`}
                      className="flex px-3 py-2 rounded-full hover:bg-[var(--hover)]"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className={`inline-flex items-center ${pathname.startsWith(`/${token.username}`) ? "font-black" : ""}`}
                      >
                        {pathname.startsWith(`/${token.username}`) ? (
                          <ProfileFill className="w-6 h-6 mr-4 text-[var(--active-mode)]" />
                        ) : (
                          <ProfileOutline className="w-6 h-6 mr-4 text-muted" />
                        )}
                        {!isIconsOnly && <span>Profile</span>}
                      </div>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  href="/settings"
                  className="flex px-3 py-2 rounded-full hover:bg-[var(--hover)]"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={`inline-flex items-center ${pathname.startsWith("/settings") ? "font-black" : ""}`}
                  >
                    {pathname.startsWith("/settings") ? (
                      <SettingFill className="w-6 h-6 mr-4 text-[var(--active-mode)]" />
                    ) : (
                      <SettingOutline className="w-6 h-6 mr-4 text-muted" />
                    )}
                    {!isIconsOnly && <span>Settings</span>}
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          {token && (
            <>
              <Button
                onClick={handleNewPostClick}
                style={{ cursor: "pointer" }}
              >
                <div className="w-full text-lg text-center py-2 px-4 border-solid border border-[var(--border-color)] rounded-full text-[var(--active-mode)] bg-[var(--hover)] hover:bg-[var(--background-primary)] transition-colors duration-200 flex items-center gap-2">
                  <Plus />
                  Post
                </div>
              </Button>
              {token && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`fixed bottom-6 flex items-center gap-3 rounded-full hover:bg-[var(--hover)] border border-solid border-[var(--border-color)] min-h-[52px] bg-[var(--background-primary)] text-[var(--text-2)] ${isIconsOnly ? "justify-center w-14 h-14 p-2" : "w-fit mx-4 px-2 py-3"}`}
                        style={{ cursor: "pointer" }}
                      >
                        <Avatar className="w-10 h-10 border-[var(--border-color)] border-solid border-2 rounded-full">
                          <AvatarImage
                            src={
                              token.photoUrl
                                ? getFullURL(token.photoUrl)
                                : "/assets/egg.jpg"
                            }
                            alt=""
                          />
                          <AvatarFallback>{token.username?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        {!isIconsOnly && (
                          <>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-[var(--active-mode)] text-left flex items-center truncate">
                                {truncateText(
                                  token.name && token.name !== ""
                                    ? token.name
                                    : token.username || "",
                                  MAX_NAME_LENGTH
                                )}
                                {token.isPremium && (
                                  <span className="ml-2 w-4 h-4 flex items-center flex-shrink-0">
                                    <BadgeBlue />
                                  </span>
                                )}
                                {token.isVip && (
                                  <span className="ml-2 w-4 h-4 flex items-center flex-shrink-0">
                                    <BadgeGold />
                                  </span>
                                )}
                                {token.isElite && (
                                  <span className="ml-2 w-4 h-4 flex items-center flex-shrink-0">
                                    <BadgeRed />
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-[var(--text-2)] text-left truncate">
                                @{truncateText(token.username || "", MAX_USERNAME_LENGTH)}
                              </div>
                            </div>
                            <div className="text-[var(--text-2)] flex-shrink-0">
                              <MoreHorizontal className="w-5 h-5" />
                            </div>
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="min-w-[200px] p-4 bg-[var(--background-primary)] border-solid border border-[var(--border-color)] rounded-xl z-50 pointer-events-auto text-[var(--text-2)]"
                    >
                      <DropdownMenuItem
                        asChild
                        className="px-4 py-2 rounded-lg hover:bg-[var(--hover)]"
                        style={{ cursor: "pointer" }}
                      >
                        <Link href={`/${token.username}`} className="flex items-center gap-3">
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="px-4 py-2 rounded-lg hover:bg-[var(--hover)]"
                        style={{ cursor: "pointer" }}
                      >
                        <Link href={`/${token.username}/edit`} className="flex items-center gap-3">
                          <Edit className="h-5 w-5" />
                          <span>Edit Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="px-4 py-2 rounded-lg hover:bg-[var(--hover)]"
                        style={{ cursor: "pointer" }}
                      >
                        <Link href="/settings" className="flex items-center gap-3">
                          <Settings className="h-5 w-5" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogOutClick}
                        className="px-4 py-2 rounded-lg hover:bg-[var(--hover)] flex items-center gap-3"
                        style={{ cursor: "pointer" }}
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Log Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </>
          )}
        </div>
        {!token && (
          <Button
            onClick={openLogin}
            className={`fixed bottom-6 text-lg text-center py-2 px-4 border-solid border border-[var(--border-color)] rounded-full text-[var(--active-mode)] hover:bg-[var(--hover)] transition-colors duration-200`}
          >
            <LogIn />
            Log In
          </Button>
        )}
        <LogInDialog open={isLogInOpen} handleLogInClose={closeLogin} />


      </aside>

      {token && (
        <>
          {token && (
            <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
              <DialogTrigger asChild>
                <Button className="text-lg text-center py-2 px-4 border-solid border border-[var(--border-color)] rounded-full text-[var(--active-mode)] hover:bg-[var(--hover)] transition-colors duration-200 flex items-center gap-2">
                  <Plus />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-[var(--background-primary)]/70 backdrop-blur-md rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Post</DialogTitle>
                </DialogHeader>
                <NewPost
                  token={token}
                  handleSubmit={() => {
                    setIsNewPostOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
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