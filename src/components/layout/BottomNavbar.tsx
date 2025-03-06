"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  Settings, 
  School, 
  Briefcase, 
  Bookmark, 
  HelpCircle,
  BarChart2,
  DollarSign,
  LifeBuoy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext, useState } from "react";
import { AuthContext } from "@/app/(vicsory)/layout";
import { HomeFill, HomeOutline } from "../../../public/svg/home";
import { NotificationFill, NotificationOutline } from "../../../public/svg/notification";
import { ChatFill, ChatOutline } from "../../../public/svg/chat";
import { ProfileFill, ProfileOutline } from "../../../public/svg/profile";
import { ExploreFill, ExploreOutline } from "../../../public/svg/explore";
import NewPostDialog from "../dialog/NewPostDialog";
import Legal from "../misc/Legal";
import { getFullURL } from "@/utilities/misc/getFullURL";

export default function BottomNavbar() {
  const pathname = usePathname();
  const { token } = useContext(AuthContext);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const baseItemClass = "flex flex-col items-center p-3 rounded-full transition-all duration-200";
  const activeClass = "text-[var(--blue)]";
  const inactiveClass = "text-gray-500 dark:text-gray-400 hover:text-[var(--hover-blue)]";
  const iconClass = "h-6 w-6";

  const handleNewPostClick = () => {
    setIsNewPostOpen(true);
  };

  const handleNewPostClose = () => {
    setIsNewPostOpen(false);
  };

  return (
    <>
      {token && (
        <div className="fixed bottom-20 right-4 z-50">
          <Button
            onClick={handleNewPostClick}
            className="rounded-full w-14 h-14 bg-[var(--background-blue)] hover:bg-[var(--hover-blue)] text-white shadow-lg flex items-center justify-center"
          >
            <span className="text-lg font-bold">+</span>
          </Button>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 z-50 w-full bg-[var(--top-bar-bg)] border-t border-solid border-[var(--border-color)] shadow-xl">
        <div className="max-w-screen-xl mx-auto px-2">
          <ul className="flex justify-between items-center h-16">
            <li>
              <Link href="/home" className={`${baseItemClass} ${pathname.startsWith("/home") ? "bg-[var(--grey)]" : "hover:bg-[var(--hover)]"}`}>
                {pathname.startsWith("/home") ? (
                  <HomeFill className={`${iconClass} ${activeClass}`} />
                ) : (
                  <HomeOutline className={`${iconClass} ${inactiveClass}`} />
                )}
              </Link>
            </li>
            <li>
              <Link href="/search" className={`${baseItemClass} ${pathname.startsWith("/search") ? "bg-[var(--grey)]" : "hover:bg-[var(--hover)]"}`}>
                {pathname.startsWith("/search") ? (
                  <ExploreFill className={`${iconClass} ${activeClass}`} />
                ) : (
                  <ExploreOutline className={`${iconClass} ${inactiveClass}`} />
                )}
              </Link>
            </li>
            <li>
              <Link href="/notifications" className={`${baseItemClass} ${pathname.startsWith("/notifications") ? "bg-[var(--grey)]" : "hover:bg-[var(--hover)]"}`}>
                {pathname.startsWith("/notifications") ? (
                  <NotificationFill className={`${iconClass} ${activeClass}`} />
                ) : (
                  <NotificationOutline className={`${iconClass} ${inactiveClass}`} />
                )}
              </Link>
            </li>
            <li>
              <Link href="/messages" className={`${baseItemClass} ${pathname.startsWith("/messages") ? "bg-[var(--grey)]" : "hover:bg-[var(--hover)]"}`}>
                {pathname.startsWith("/messages") ? (
                  <ChatFill className={`${iconClass} ${activeClass}`} />
                ) : (
                  <ChatOutline className={`${iconClass} ${inactiveClass}`} />
                )}
              </Link>
            </li>
            {token && (
              <li>
                <Link href={`/${token.username}`} className={`${baseItemClass} ${pathname.startsWith(`/${token.username}`) ? "bg-[var(--grey)]" : "hover:bg-[var(--hover)]"}`}>
                  {pathname.startsWith(`/${token.username}`) ? (
                    <ProfileFill className={`${iconClass} ${activeClass}`} />
                  ) : (
                    <ProfileOutline className={`${iconClass} ${inactiveClass}`} />
                  )}
                </Link>
              </li>
            )}
            <li>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`${baseItemClass} hover:bg-[var(--hover)]`}
                  >
                    <div className="rounded-full border border-solid border-[var(--border-color)] p-1.5">
                      <Menu className={`${iconClass} ${pathname.startsWith("/settings") || pathname.startsWith("/school") || pathname.startsWith("/business") ? activeClass : inactiveClass}`} />
                    </div>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[300px] bg-[var(--background-primary)] border-l border-solid border-[var(--border-color)] overflow-y-auto"
                >
                  {token && (
                    <div className="mt-6 mx-3">
                      <Link href={`/${token.username}`} onClick={() => setIsSheetOpen(false)}>
                        <div className="flex items-center gap-4 p-4 border border-solid border-[var(--border-color)] rounded-2xl bg-[var(--grey)] shadow-sm hover:bg-[var(--hover)] transition-colors duration-200">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"} alt={token.username} />
                            <AvatarFallback>{token.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-lg font-bold">
                              {token.name !== "" ? token.name : token.username}
                            </div>
                            <div className="text-base text-muted">@{token.username}</div>
                          </div>
                        </div>
                      </Link>
                      <div className="my-4 border border-solid border-[var(--border-color)]" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 px-3">
                    {/* Professional Section */}
                    <Link 
                      href="/school" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <School className="h-5 w-5" />
                      Schools
                    </Link>
                    <Link 
                      href="/business" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Briefcase className="h-5 w-5" />
                      Jobs
                    </Link>
                    <Link 
                      href="/dashboard" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <BarChart2 className="h-5 w-5" />
                      Dashboard
                    </Link>

                    <div className="my-2 border border-solid border-[var(--border-color)]" />

                    {/* Monetization & Content */}
                    <Link 
                      href="/monetize" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <DollarSign className="h-5 w-5" />
                      Monetize
                    </Link>
                    <Link 
                      href="/bookmarks" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Bookmark className="h-5 w-5" />
                      Bookmarks
                    </Link>
                    <Link 
                      href="/analytics" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <BarChart2 className="h-5 w-5" />
                      Analytics
                    </Link>

                    <div className="my-2 border border-solid border-[var(--border-color)]" />

                    {/* Support & Account */}
                    <Link 
                      href="/support" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <LifeBuoy className="h-5 w-5" />
                      Support
                    </Link>
                    <Link 
                      href="/help" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <HelpCircle className="h-5 w-5" />
                      Help Center
                    </Link>
                    <Link 
                      href="/team" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Users className="h-5 w-5" />
                      Team
                    </Link>
                    <Link 
                      href="/settings" 
                      className="w-full py-2 px-3 flex items-center gap-2 hover:bg-[var(--hover)] rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                  </div>
                  <div className="my-4 border border-solid border-[var(--border-color)]" />
                  {/* Legal Section */}
                  <div className="mt-4 text-muted pt-4 px-3">
                    <Legal />
                  </div>
                </SheetContent>
              </Sheet>
            </li>
          </ul>
        </div>
      </nav>
      {token && (
        <NewPostDialog 
          open={isNewPostOpen} 
          handleNewPostClose={handleNewPostClose} 
          token={token} 
        />
      )}
    </>
  );
}