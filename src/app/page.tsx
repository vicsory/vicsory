"use client";

import { useState } from "react";
import LogInDialog from "@/components/dialog/LogInDialog";
import HomeLayout from "./(vicsory)/layout";
import ExplorePage from "./(vicsory)/explore/page";

export default function RootPage() {
    const [isLogInOpen, setIsLogInOpen] = useState(true);

    const handleLogInClose = () => setIsLogInOpen(false);

    return (
        <>
            <div className="relative min-h-screen w-full">
                {/* Background: HomeLayout + Explore */}
                <div
                    className={`${isLogInOpen ? "blur-sm pointer-events-none" : ""} transition-all duration-300`}
                >
                    <HomeLayout>
                        <ExplorePage />
                    </HomeLayout>
                </div>
                {/* Login overlay */}
                <LogInDialog
                    open={isLogInOpen}
                    handleLogInClose={handleLogInClose}
                />
            </div>
        </>
    );
}
