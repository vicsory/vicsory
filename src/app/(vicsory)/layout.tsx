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
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="fixed inset-y-0 left-0 w-80 overflow-y-auto pt-14 pb-10 scrollbar-hide">
              <LeftSidebar />
            </div>
          </aside>
          <main className="flex-1 min-w-0 top-0 border-x border-solid border-[var(--border)] bg-[var(--background-secondary]">
              {children}
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
