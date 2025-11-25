"use client";

import React, { useState } from "react";
import HomeLayout from "./(vicsory)/layout";
import LogInDialog from "@/components/dialog/LogInDialog";
import Explore from "./(vicsory)/explore/explore";

export default function Rootpage() {
  const [isLogInOpen, setIsLogInOpen] = useState(true);

  const handleLogInClose = () => setIsLogInOpen(false);

  return (
    <div className="relative min-h-screen">
      {/* Background: HomeLayout + Explore */}
      <div
        className={`${isLogInOpen ? "blur-sm pointer-events-none" : ""} transition-all duration-300`}
      >
        <HomeLayout>
          <Explore />
        </HomeLayout>
      </div>

      {/* Login overlay */}
      <LogInDialog 
        open={isLogInOpen} 
        handleLogInClose={handleLogInClose}
      />
    </div>
  );
}
