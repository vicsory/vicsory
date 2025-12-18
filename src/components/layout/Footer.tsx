"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth-context";
import { Button } from "../ui/button";
import LogInDialog from "@/components/dialog/LogInDialog";
import { LogIn } from "lucide-react";



export default function Footer() {
    const { token, isPending } = useContext(AuthContext);
    const [isLogInOpen, setIsLogInOpen] = useState(false);


    if (isPending) return null;

    if (!token)
        return (
            <footer className="w-full sticky gap-6 flex items-center justify-center bg-[var(--background-secondary)] py-4 bottom-0 border-t border-solid border-[var(--border)]">
                <div className="flex flex-col text-[var(--text)]">
                    <h1 className="font-bold text-2xl">Don’t miss what’s happening</h1>
                    <p className="font-medium text-lg">People on Vicsory are the first to know.</p>
                </div>
                <div className="gap-4 flex items-center">
                    <Button
                        onClick={() => setIsLogInOpen(true)}
                        className="text-base hover:bg-[var(--blue-secondary)] bg-[var(--blue)] text-white px-4 py-2 rounded-full text-center font-semibold hover:opacity-70 transition border border-solid border-[var(--border)]"
                    >
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline text-lg">Log In</span>
                    </Button>
                </div>
                <LogInDialog open={isLogInOpen} handleLogInClose={() => setIsLogInOpen(false)} />
            </footer>
        );

    return null;
}
