"use client";

import { useContext, useState } from "react";
import { Switch } from "@mui/material";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ThemeContext } from "@/app/providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [openDialog, setOpenDialog] = useState<string | null>(null);

    const handleLinkClick = (dialogId: string) => {
        setOpenDialog(dialogId);
    };

    const handleCloseDialog = () => {
        setOpenDialog(null);
    };

    return (
        <main className="min-h-screen bg-[var(--background-primary)]">
            <h1 className="p-8 text-xl font-bold border-solid border-b border-[var(--border-color)] sticky top-0 z-50 bg-[var(--background-primary)] opacity-90">
                Settings
            </h1>
            <div className="max-w-2xl mx-auto p-4 space-y-6">
                {/* Theme Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium">Color Theme</h2>
                                <p className="text-sm text-muted-foreground">
                                    {theme === "dark" ? "Lights Out" : "Default"}
                                </p>
                            </div>
                            <Switch
                                checked={theme === "dark"}
                                onChange={toggleTheme}
                                inputProps={{ "aria-label": "Toggle dark mode" }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Profile</h2>
                            <p className="text-sm text-muted-foreground">
                                Update your username, bio, and other details.
                            </p>
                            <Dialog open={openDialog === "profile"} onOpenChange={handleCloseDialog}>
                                <DialogTrigger asChild>
                                    <a
                                        href="#"
                                        className="text-sm text-[#1E90FE] hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick("profile");
                                        }}
                                    >
                                        Edit Profile
                                    </a>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg p-6">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your username, bio, and other profile details here.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Profile editing functionality goes here.
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Change Password</h2>
                            <p className="text-sm text-muted-foreground">Update your account password.</p>
                            <Dialog open={openDialog === "password"} onOpenChange={handleCloseDialog}>
                                <DialogTrigger asChild>
                                    <a
                                        href="#"
                                        className="text-sm text-[#1E90FE] hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick("password");
                                        }}
                                    >
                                        Change Password
                                    </a>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg p-6">
                                    <DialogHeader>
                                        <DialogTitle>Change Password</DialogTitle>
                                        <DialogDescription>
                                            Enter your new password to update your account security.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Password change form goes here.
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium">Email Notifications</h2>
                                <p className="text-sm text-muted-foreground">
                                    Receive updates via email.
                                </p>
                            </div>
                            <Switch
                                checked={false}
                                onChange={() => console.log("Toggle email notifications")}
                                inputProps={{ "aria-label": "Toggle email notifications" }}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium">Push Notifications</h2>
                                <p className="text-sm text-muted-foreground">
                                    Receive push notifications on your device.
                                </p>
                            </div>
                            <Switch
                                checked={false}
                                onChange={() => console.log("Toggle push notifications")}
                                inputProps={{ "aria-label": "Toggle push notifications" }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Support */}
                <Card>
                    <CardHeader>
                        <CardTitle>Support</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Help Center</h2>
                            <p className="text-sm text-muted-foreground">
                                Find answers to common questions.
                            </p>
                            <Dialog open={openDialog === "help"} onOpenChange={handleCloseDialog}>
                                <DialogTrigger asChild>
                                    <a
                                        href="#"
                                        className="text-sm text-[#1E90FE] hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick("help");
                                        }}
                                    >
                                        Visit Help Center
                                    </a>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg p-6">
                                    <DialogHeader>
                                        <DialogTitle>Help Center</DialogTitle>
                                        <DialogDescription>
                                            Browse FAQs and common troubleshooting tips.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Help center content goes here.
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Contact Us</h2>
                            <p className="text-sm text-muted-foreground">
                                Get in touch with our support team.
                            </p>
                            <Dialog open={openDialog === "contact"} onOpenChange={handleCloseDialog}>
                                <DialogTrigger asChild>
                                    <a
                                        href="#"
                                        className="text-sm text-[#1E90FE] hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick("contact");
                                        }}
                                    >
                                        Contact Support
                                    </a>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg p-6">
                                    <DialogHeader>
                                        <DialogTitle>Contact Support</DialogTitle>
                                        <DialogDescription>
                                            Send a message to our support team.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Contact form or support details go here.
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                {/* About */}
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Version: 1.0.0
                        </p>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Vicsory. All rights reserved.
                        </p>
                        <div className="space-y-1">
                            <Dialog open={openDialog === "terms"} onOpenChange={handleCloseDialog}>
                                <DialogTrigger asChild>
                                    <a
                                        href="#"
                                        className="block text-sm text-[#1E90FE] hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick("terms");
                                        }}
                                    >
                                        Terms of Service
                                    </a>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg p-6">
                                    <DialogHeader>
                                        <DialogTitle>Terms of Service</DialogTitle>
                                        <DialogDescription>
                                            Read our terms and conditions.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Terms of service content goes here.
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Dialog open={openDialog === "privacy"} onOpenChange={handleCloseDialog}>
                                <DialogTrigger asChild>
                                    <a
                                        href="#"
                                        className="block text-sm text-[#1E90FE] hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick("privacy");
                                        }}
                                    >
                                        Privacy Policy
                                    </a>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg p-6">
                                    <DialogHeader>
                                        <DialogTitle>Privacy Policy</DialogTitle>
                                        <DialogDescription>
                                            Learn about how we handle your data.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Privacy policy content goes here.
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}