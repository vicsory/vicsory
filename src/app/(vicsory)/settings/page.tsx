"use client";

import { useContext, useState } from "react";
import { Link, Switch } from "@mui/material";

import { ThemeContext } from "@/app/providers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { AuthContext } from "@/contexts/auth-context";

export default function SettingsPage() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { token } = useContext(AuthContext);
    const [openDialog, setOpenDialog] = useState<string | null>(null);

    const handleLinkClick = (dialogId: string) => {
        setOpenDialog(dialogId);
    };


    return (
        <main className="min-h-screen bg-[var(--background-primary)] top-0">
            <h1 className="flex items-center p-4 text-xl text-[var(--text)] font-bold border-solid border-b border-[var(--border)]">Settings</h1>
            <div className="color-theme-switch">
                <div className="space-y-4 bg-[var(--background-primary)] shadow-none">
                    <div className="space-y-2">
                        <h2 className="text-lg font-medium text-[var(--text)]">Color Theme</h2>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Choose your preferred theme.
                        </p>
                        <span className="flex items-center">
                            <Switch checked={theme === "dark" ? true : false} onChange={toggleTheme} />
                            <div className="text-sm text-[var(--text)]">{theme === "dark" ? "Dark mode" : "Light mode"}</div>
                        </span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-lg font-medium text-[var(--text)]">Profile</h2>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Update your username, bio, and other details.
                        </p>
                        <Link
                            href={token?.username ? `/${token.username}/edit` : "/explore"}
                            className="text-sm text-[var(--blue)] hover:underline"
                        >
                            {token?.username ? "Edit Profile" : "Log in to Edit Profile"}
                        </Link>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h2 className="text-lg font-medium text-[var(--text)]">Change Password</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Update your account password.</p>
                        <Link
                            href="#"
                            className="text-sm text-[var(--blue)] hover:underline"
                            onClick={(e) => {
                                e.preventDefault();
                                handleLinkClick("password");
                            }}
                        >
                            Change Password
                        </Link>
                    </div>
                </div>
            </div>
            {/* <Dialog open={openDialog === "password"} onOpenChange={handleCloseDialog}>
                <DialogContent className="max-w-lg p-6">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>Update your account security.</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <p className="text-sm text-[var(--twitter-muted)]">
                            Password change form goes here.
                        </p>
                    </div>
                </DialogContent>
            </Dialog> */}
        </main>
    );
}
