import { useState } from "react";
import { Tooltip } from "@mui/material";
import { UserProps } from "@/types/UserProps";
import Link from "next/link";
import { BadgeCheck, X, } from "lucide-react";

export default function CompleteProfileReminder({ token }: { token: UserProps }) {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen &&
                (!token.name ||
                    !token.description ||
                    !token.category ||
                    !token.photoUrl ||
                    !token.location ||
                    !token.website ||
                    !token.headerUrl) && (
                    <div 
                        className="relative flex flex-col bg-[var(--background-primary)] border-[var(--border-color)] border border-solid p-6 rounded-lg text-[var(--active-mode)]"
                        style={{ borderRadius: '0.5rem' }}
                    >
                        <button
                            className="absolute top-2 right-2 text-[var(--active-mode)] hover:bg-[var(--hover)] p-2 rounded-full transition-colors duration-150"
                            onClick={handleClose}
                            aria-label="Close profile reminder"
                        >
                            <X size={18} />
                        </button>
                        <div className="mb-4">
                            <h1 className="text-xl font-semibold tracking-tight">
                                Finalize Your Vicsory Profile
                            </h1>
                        </div>
                        <p className="text-sm mb-5 leading-relaxed text-[var(--text-2)]">
                            Elevate your Vicsory presence with these simple steps:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                            {!token.name && (
                                <Tooltip
                                    title="Add your name to define your identity."
                                    placement="top"
                                >
                                    <li className="hover:text-[var(--blue)] transition-colors duration-150">
                                        Your name
                                    </li>
                                </Tooltip>
                            )}
                            {!token.description && (
                                <Tooltip
                                    title="Introduce yourself with a short bio."
                                    placement="top"
                                >
                                    <li className="hover:text-[var(--blue)] transition-colors duration-150">
                                        A bio
                                    </li>
                                </Tooltip>
                            )}
                            {!token.category && (
                                <Tooltip
                                    title="Pick a category to showcase your niche."
                                    placement="top"
                                >
                                    <li className="hover:text-[var(--blue)] transition-colors duration-150">
                                        A category
                                    </li>
                                </Tooltip>
                            )}
                            {!token.photoUrl && (
                                <Tooltip
                                    title="Add a photo to bring your profile to life."
                                    placement="top"
                                >
                                    <li className="hover:text-[var(--blue)] transition-colors duration-150">
                                        A profile picture
                                    </li>
                                </Tooltip>
                            )}
                            {!token.headerUrl && (
                                <Tooltip
                                    title="Enhance your profile with a header image."
                                    placement="top"
                                >
                                    <li className="hover:text-[var(--blue)] transition-colors duration-150">
                                        A header image
                                    </li>
                                </Tooltip>
                            )}
                            {!token.location && (
                                <Tooltip
                                    title="Share your location to connect locally."
                                    placement="top"
                                >
                                    <li className="hover:text-[var(--blue)] transition-colors duration-150">
                                        Your location
                                    </li>
                                </Tooltip>
                            )}
                            {!token.website && (
                                <Tooltip
                                    title="Link your website to boost your reach."
                                    placement="top"
                                >
                                    <li className="hover:text-[var(--blue)] transition-colors duration-150">
                                        Your website
                                    </li>
                                </Tooltip>
                            )}
                        </ol>
                        <div className="flex flex-col gap-3 mt-6">
                            <Link
                                href={`/${token.username}/edit`}
                                className="border border-solid border-[var(--border-color)] flex items-center justify-center bg-[var(--grey)] text-[var(--active-mode)] px-5 py-2 rounded-full hover:border hover:border-solid hover:border-[var(--border-color)] hover:bg-transparent transition-colors duration-150 font-medium tracking-wide flex-1"
                            >
                                Update Profile
                            </Link>
                            <Link
                                href="/school"
                                className="border border-solid border-[var(--border-color)] flex items-center justify-center bg-[var(--blue)] text-white px-5 py-2 rounded-full hover:bg-[var(--hover-blue)] transition-colors duration-150 font-medium tracking-wide flex-1"
                            >
                                Create Course
                            </Link>
                            {!token.isPremium && (
                                <Link
                                    href="/verify"
                                    className="border border-solid border-[var(--active-mode)] flex items-center justify-center gap-1 bg-transparent text-[var(--active-mode)] px-5 py-2 rounded-full hover:bg-[var(--hover-blue)] hover:border-transparent hover:text-white transition-colors duration-150 font-medium tracking-wide flex-1"
                                >
                                    <BadgeCheck size={16} fill="#1E90FE" stroke="#fff"/>
                                    Get Verified Now!
                                </Link>
                            )}
                        </div>
                    </div>
                )}
        </>
    );
}