"use client";

import Image from "next/image";
import Search from "@/components/misc/Search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogIn, Plus } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import LogInDialog from "@/components/dialog/LogInDialog";
import { getFullURL } from "@/utilities/misc/getFullURL";
import NewTweet from "../tweet/NewTweet";
import { AuthContext } from "@/contexts/auth-context";

const Topbar = () => {
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { token } = useContext(AuthContext);
  const pathname = usePathname();
  const isExplorePage = pathname.startsWith("/explore");

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const scrollingDown = current > lastScrollY.current && current > 100;

      setIsVisible(!scrollingDown);
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`
          fixed top-0 inset-0 w-full left-0 right-0 h-16 z-50 pointer-events-none
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
          transition-transform duration-300 ease-out
        `}
      >
        <div
          className={`absolute inset-0 border-b border-solid border-[var(--border)] bg-[var(--background-primary)]/80 backdrop-blur-xl h-full gap-8 flex items-center justify-between px-4 pointer-events-auto `}
        >
          <Link href="/explore" className="w-fit pl-2 gap-2 top-0 items-center flex" style={{ cursor: "pointer" }}>
            <div className="relative w-8 h-8">
              <Image
                className="object-contain transition-transform duration-200 group-hover:scale-110"
                alt="Vicsory logo"
                src="/assets/favicon.png"
                fill
                sizes="32px"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-[var(--text)]">vicsory</span>
          </Link>
          {/* Search */}
          <Search />

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {!token ? (
              <Button
                onClick={() => setIsLogInOpen(true)}
                className="border border-solid bg-[var(--background-primary)] border-[var(--border)] rounded-full px-3 sm:px-5 py-2.5 font-medium flex items-center gap-2 hover:bg-[var(--background-secondary)]"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Log In</span>
              </Button>
            ) : (
              <>
                {/* New Post */}
                <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen} >
                  <DialogTrigger asChild>
                    <Button
                      className="text-lg w-fit text-center text-[var(--text)] hover:text-[var(--text-secondary)] py-2 px-4 border border-solid border-[var(--border)] rounded-full flex items-center gap-2 hover:bg-[var(--background-secondary)] transition-colors duration-200"
                    >
                      <Plus />
                      Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New Post</DialogTitle>
                    </DialogHeader>
                    <NewTweet
                      token={token}
                      handleSubmit={() => {
                        setIsNewPostOpen(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>

                {/* Avatar */}
                <Link href={`/${token.username}`} className="flex items-center">
                  <Avatar className="w-10 h-10 border-[var(--border)] border-solid border-2 rounded-full">
                    <AvatarImage
                      src={
                        token.photoUrl
                          ? getFullURL(token.photoUrl)
                          : "/assets/egg.jpg"
                      }
                      alt=""
                    />
                    <AvatarFallback>
                      {token.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-16" />
      <LogInDialog open={isLogInOpen} handleLogInClose={() => setIsLogInOpen(false)} />
    </>
  );
};

export default Topbar;
