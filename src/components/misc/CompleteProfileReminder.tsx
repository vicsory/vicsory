"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { UserProps } from "@/types/UserProps";

export default function CompleteProfileReminder({ token }: { token: UserProps }) {
    const [isOpen, setIsOpen] = useState(true);

    if (
        !isOpen ||
        (token.name &&
            token.description &&
            token.photoUrl &&
            token.location &&
            token.website &&
            token.headerUrl)
    ) {
        return null;
    }

    const tooltipClass = "max-w-xs text-sm text-[var(--text)] bg-[var(--background-secondary)] rounded-xl";

    return (
        <Card className="p-4 relative border border-solid border-[var(--border)] rounded-xl shadow-sm">
            {/* CLOSE BUTTON TOP RIGHT */}
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 absolute top-2 right-2  text-[var(--text)] hover:text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] rounded-full"
                onClick={() => setIsOpen(false)}
            >
                <X className="h-4 w-4" />
            </Button>

            <CardHeader className="flex flex-row items-center justify-between p-0 mb-2">
                <CardTitle className="text-lg font-semibold text-[var(--text)]">Complete your account</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <p className="text-base text-[var(--text-secondary)] mb-3">
                    Your Vicsory profile is not fully completed yet. Fill in the missing details to improve your visibility and overall experience:
                </p>

                <ol className="list-disc list-inside space-y-2 text-base text-[var(--text)]">
                    <TooltipProvider>
                        {!token.name && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <li className="cursor-pointer">Add your display name</li>
                                </TooltipTrigger>
                                <TooltipContent className={tooltipClass}>
                                    Your display name helps others recognize you across the platform.
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {!token.description && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <li className="cursor-pointer">Write a short bio</li>
                                </TooltipTrigger>
                                <TooltipContent className={tooltipClass}>
                                    Tell others who you are or what you usually share on Vicsory.
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {!token.photoUrl && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <li className="cursor-pointer">Upload a profile picture</li>
                                </TooltipTrigger>
                                <TooltipContent className={tooltipClass}>
                                    A profile picture helps personalize your account and build trust.
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {!token.headerUrl && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <li className="cursor-pointer">Add a header image</li>
                                </TooltipTrigger>
                                <TooltipContent className={tooltipClass}>
                                    A header image makes your profile more visually attractive.
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {!token.location && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <li className="cursor-pointer">Specify your location</li>
                                </TooltipTrigger>
                                <TooltipContent className={tooltipClass}>
                                    Sharing your location helps others know where you are posting from.
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {!token.website && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <li className="cursor-pointer">Link your website</li>
                                </TooltipTrigger>
                                <TooltipContent className={tooltipClass}>
                                    Add your website to showcase your work, projects, or online identity.
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </ol>

                <Link href={`/${token.username}/edit`}>
                    <Button className="flex items-center text-lg w-fit text-center mt-4 py-2 px-4 border-solid border border-[var(--border)] rounded-full text-[var(--text)] hover:text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] transition-colors duration-200">
                        Update Profile
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
