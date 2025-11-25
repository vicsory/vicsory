"use client";

import { createContext } from "react";
import Footer from "@/components/layout/Footer";
import LeftSidebar from "@/components/layout/LeftSidebar";
// Removed RightSidebar import as YouTube typically doesn't have one on the home feed
import BottomNavbar from "@/components/layout/BottomNavbar";
import { AuthProps } from "@/types/TokenProps";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "@/lib/ThemeContext";
import { usePathname } from "next/navigation";
import Topbar from "@/components/trending/top-bar/top-bar"; // We'll use this as the Header

const AuthContext = createContext<AuthProps>({
  token: null,
  isPending: true,
  refreshToken: () => Promise.resolve(),
});

const DESKTOP_SIDEBAR_WIDTH = "w-[240px]";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { isGoldTheme } = useTheme();
  const pathname = usePathname();

  const isExplore = pathname.startsWith("/explore");

  return (
    <AuthContext.Provider value={auth}>
      <div
        className={`min-h-screen flex flex-col overflow-x-hidden ${isGoldTheme ? "gold-gradient" : ""}`}
      >
        <div className="fixed top-0 left-0 right-0 z-50 m-0 p-0">
          <Topbar />
        </div>

        <div className="flex flex-row flex-1 mt-[45px] xl:mt-[56px] min-h-0">

          <div className={`hidden lg:flex fixed top-[56px] left-0 h-[calc(100vh-56px)] ${DESKTOP_SIDEBAR_WIDTH} z-30`}>
            <LeftSidebar isTablet={false} />
          </div>

          <main
            className={`flex-1 w-full max-w-full lg:ml-[240px] pb-20`}
          >
            {children}
          </main>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border-color)] border-solid bg-background">
          <BottomNavbar />
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export { AuthContext };