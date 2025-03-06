"use client";

import { createContext } from "react";

import Footer from "@/components/layout/Footer";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { AuthProps } from "@/types/TokenProps";
import useAuth from "@/hooks/useAuth";
import BottomNavbar from "@/components/layout/BottomNavbar";

const AuthContext = createContext<AuthProps>({ token: null, isPending: true, refreshToken: () => Promise.resolve() });

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            <div className="min-h-screen flex flex-col xl:flex-row xl:max-w-[1265px] xl:mx-auto xl:gap-2.5 ">
                {/* Left Sidebar - Hidden on mobile, visible on larger screens */}
                <div className="hidden xl:flex xl:sticky xl:top-0 xl:h-screen xl:w-[275px] shrink-0">
                    <LeftSidebar />
                </div>

                {/* Bottom Navbar - Mobile only */}
                <div className="xl:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border-color)] border-solid">
                    <BottomNavbar />
                </div>

                {/* Main Content - Full width on mobile, fixed width on desktop */}
                <main className="flex-1 w-full max-w-[600px] mx-auto xl:mx-0 xl:border-x xl:border-[var(--border-color)] border-solid">
                    {children}
                </main>

                {/* Right Sidebar - Hidden on mobile/tablet, visible on desktop */}
                <div className="hidden xl:flex xl:sticky xl:top-0 xl:h-screen xl:w-[350px] shrink-0">
                    <RightSidebar />
                </div>

                {/* Footer - Full width on mobile, hidden on desktop (X.com typically doesn't show a footer) */}
                <div className="mt-auto xl:hidden">
                    <Footer />
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export { AuthContext };