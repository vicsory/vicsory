"use client";

import { useContext, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem,  } from "@/components/ui/radio-group";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ThemeContext } from "@/app/providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "../layout";
import Link from "next/link";

import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    const { theme, setTheme } = useContext(ThemeContext);
    const { token } = useContext(AuthContext);
    const [openDialog, setOpenDialog] = useState<string | null>(null);

    const handleLinkClick = (dialogId: string) => {
        setOpenDialog(dialogId);
    };

    const handleCloseDialog = () => {
        setOpenDialog(null);
    };

    return (
        <main className="min-h-screen bg-[var(--background-primary)]">
            <h1 className="p-4 text-xl font-bold border-solid border-b border-[var(--border-color)] sticky top-0 z-50 bg-[var(--background-primary)] opacity-90">
                Settings
            </h1>
            <div className="space-y-6">
                {/* Theme Settings */}
                <Card className="shadow-none mx-0">
                    <CardHeader>
                        <CardTitle >Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h2 className="text-lg font-medium">Color Theme</h2>
                            <p className="text-sm text-[var(--twitter-muted)]">
                                Choose your preferred theme.
                            </p>
                            <RadioGroup
                                value={theme}
                                onValueChange={(value: "light" | "dark" | "gold") => setTheme(value)}
                                className="mt-2 space-y-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="light" id="light" />
                                    <Label htmlFor="light">Default (Light)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="dark" id="dark" />
                                    <Label htmlFor="dark">Lights Out (Dark)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Profile</h2>
                            <p className="text-sm text-[var(--twitter-muted)]">
                                Update your username, bio, and other details.
                            </p>
                            <Link
                                href={token?.username ? `/${token.username}/edit` : "/login"}
                                className="text-sm text-[var(--twitter-blue)] hover:underline"
                            >
                                {token?.username ? "Edit Profile" : "Log in to Edit Profile"}
                            </Link>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Change Password</h2>
                            <p className="text-sm text-[var(--twitter-muted)]">Update your account password.</p>
                            <Link
                                href="#"
                                className="text-sm text-[var(--twitter-blue)] hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick("password");
                                }}
                            >
                                Change Password
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Dialog open={openDialog === "password"} onOpenChange={handleCloseDialog}>
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
            </Dialog>
        </main>
    );
}