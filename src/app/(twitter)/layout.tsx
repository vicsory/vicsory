"use client";

import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import Topbar from "@/components/layout/top-bar";
import Footer from "@/components/layout/Footer";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/contexts/auth-context";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="fixed top-0 left-0 right-0 z-50">
          <Topbar />
        </header>

        <div className="flex flex-1 pt-14">
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="fixed inset-y-0 left-0 w-60 overflow-y-auto pt-14 pb-10 scrollbar-hide border-r">
              <LeftSidebar />
            </div>
          </aside>

          <aside className="hidden sm:block lg:hidden w-20 flex-shrink-0">
            <div className="fixed inset-y-0 left-0 w-20 overflow-y-auto pt-14 pb-10 scrollbar-hide">
              <LeftSidebar />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="max-w-screen-2xl mx-auto px-0 sm:px-4 lg:px-6 xl:px-24">
              {children}
            </div>
          </main>

          <aside className="hidden 2xl:block w-96 flex-shrink-0">
            <div className="fixed right-0 top-0 h-screen w-96 overflow-y-auto pt-14 pb-10 scrollbar-hide">
              <RightSidebar />
            </div>
          </aside>
        </div>

        <Footer />
      </div>
    </AuthContext.Provider>
  );
}
