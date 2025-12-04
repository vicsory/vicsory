"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

import SignUpDialog from "@/components/dialog/SignUpDialog";
import LogInDialog from "@/components/dialog/LogInDialog";
import { logInAsTest } from "@/utilities/fetch";
import GlobalLoading from "@/components/misc/GlobalLoading";
import CustomSnackbar from "@/components/misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import HomeLayout from "./(twitter)/layout";
import ExplorePage from "./(twitter)/explore/page";
import Topbar from "@/components/layout/top-bar";

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
