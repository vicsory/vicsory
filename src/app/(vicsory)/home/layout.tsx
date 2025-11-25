"use client";

import { useState } from "react";
import HomePage from "./page";
import Explore from "../explore/explore";

type MainTab = "following" | "explore";
type Category = "company" | "startup" | "entrepreneur" | "investor" | "non-profit" | null;

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab | Category>("following");


  const handleTabClick = (tab: MainTab | Category) => setActiveTab(tab);

  const TabButton = ({ tabName, children }: { tabName: MainTab | Category; children: React.ReactNode }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => handleTabClick(tabName)}
        className={`
          relative flex-shrink-0 px-6 py-3 text-[15px] whitespace-nowrap
          flex items-center justify-center
          transition-colors duration-150
          ${isActive ? "text-[var(--active-mode)] font-bold bg-[var(--hover)]" : "text-[var(--text-2)] font-normal hover:text-[var(--active-mode)]"}
        `}
      >
        {children}
        <span
          className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ${
            isActive ? "bg-[var(--blue)]" : "bg-transparent"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="w-full mx-auto">
      {/* Tabs container */}
      <div
        className={`
          sticky top-0 z-10 w-full bg-[var(--background-primary)] backdrop-blur-lg
          border-b border-[var(--border-color)] transition-all duration-200
        `}
      >
        <div className="flex overflow-x-auto scrollbar-none flex-nowrap gap-2 py-1 snap-x snap-mandatory">
          {/* Primary Tabs */}
          <TabButton tabName="explore">Explore</TabButton>
          <TabButton tabName="following">Following</TabButton>

          {/* Secondary Categories */}
          <TabButton tabName="company">Company</TabButton>
          <TabButton tabName="startup">Startup</TabButton>
          <TabButton tabName="entrepreneur">Entrepreneur</TabButton>
          <TabButton tabName="investor">Investor</TabButton>
          <TabButton tabName="non-profit">Non-Profit</TabButton>
        </div>
      </div>

      {/* Tab content */}
      <div className="w-full">
        {activeTab !== "following" ? <Explore activeCategory={activeTab} /> : <HomePage />}
      </div>

      <style jsx>{`
        /* Hide scrollbar for all browsers */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
