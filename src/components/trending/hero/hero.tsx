"use client";

import React from "react";
import VictoryCard from "./components/vicsory-card";
import LearnCard from "./components/learn-card";
import InvestorsCard from "./components/investor-card";
import VerifyCard from "./components/verify-card";

export default function Hero() {
  return (
    <section className="w-full h-full overflow-hidden bg-transparent">
      <div className="scroll-container h-full items-center md:w-full gap-4 py-2 px-4 md:px-4 lg:px-4 xl:px-4">
        <div className="shrink-0 md:max-w-none">
          <VictoryCard />
        </div>
        
        <div className="shrink-0 md:max-w-none">
          <InvestorsCard />
        </div>

        <div className="shrink-0 md:max-w-none">
          <LearnCard />
        </div>

      </div>
      <div className="flex w-full">
        <VerifyCard />
      </div>

      <style jsx>{`
        .scroll-container {
          display: flex;
          overflow-x: auto;
        }

        /* Desktop: Keep scroll, but cap gap at 20px */
        @media (min-width: 768px) {
          .scroll-container {
            display: flex;
          }
        }

        /* Hide scrollbar */
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
        .scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
