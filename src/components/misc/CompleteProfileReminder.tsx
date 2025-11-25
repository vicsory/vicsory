import { useState } from "react";
import { Tooltip } from "@mui/material";
import { UserProps } from "@/types/UserProps";
import Link from "next/link";
import { BadgeCheck, Plus, X } from "lucide-react";

export default function CompleteProfileReminder({ token }: { token: UserProps }) {
    const [isOpen, setIsOpen] = useState(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            {isOpen && (!token.name || !token.description || !token.category || !token.photoUrl || !token.location || !token.website || !token.headerUrl) && (
                <div className="relative flex flex-col bg-[var(--background-primary)] border-[var(--border-color)] border border-solid p-3 rounded-lg text-[var(--active-mode)]" style={{ borderRadius: '0.5rem' }}>
                    <button className="absolute top-1 right-1 text-[var(--active-mode)] hover:bg-[var(--hover)] p-1 rounded-full transition-colors duration-150" onClick={handleClose} aria-label="Close profile reminder"><X size={16} /></button>
                    <h1 className="text-xl font-semibold tracking-tight mb-1">Complete Your Profile</h1>
                    <p className="text-lg text-[var(--active-mode)] mb-2">Enhance your presence with:</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {!token.name && <Tooltip title="Add your name to define your identity." placement="top"><span className="hover:text-[var(--blue)] text-muted transition-colors duration-150 cursor-default">Name</span></Tooltip>}
                        {!token.description && <Tooltip title="Introduce yourself with a short bio." placement="top"><span className="hover:text-[var(--blue)] text-muted transition-colors duration-150 cursor-default">Bio</span></Tooltip>}
                        {!token.category && <Tooltip title="Pick a category to showcase your niche." placement="top"><span className="hover:text-[var(--blue)] text-muted transition-colors duration-150 cursor-default">Category</span></Tooltip>}
                        {!token.photoUrl && <Tooltip title="Add a photo to bring your profile to life." placement="top"><span className="hover:text-[var(--blue)] text-muted transition-colors duration-150 cursor-default">Photo</span></Tooltip>}
                        {!token.headerUrl && <Tooltip title="Enhance your profile with a header image." placement="top"><span className="hover:text-[var(--blue)] text-muted transition-colors duration-150 cursor-default">Header</span></Tooltip>}
                        {!token.location && <Tooltip title="Share your location to connect locally." placement="top"><span className="hover:text-[var(--blue)] text-muted transition-colors duration-150 cursor-default">Location</span></Tooltip>}
                        {!token.website && <Tooltip title="Link your website to boost your reach." placement="top"><span className="hover:text-[var(--blue)] text-muted transition-colors duration-150 cursor-default">Website</span></Tooltip>}
                    </div>
                    <div className="flex flex-row gap-2 mt-2">
                        <Link href={`/${token.username}/edit`} className="w-full text-lg items-center justify-center py-2 px-4 border-solid border border-[var(--border-color)] rounded-full text-[var(--active-mode)] hover:bg-[var(--hover)] transition-colors duration-200 flex">Update</Link>
                        {!token.isPremium && <Link href="/verify" className="border border-solid border-[var(--active-mode)] flex items-center justify-center gap-1 bg-transparent text-[var(--active-mode)] px-3 py-1 rounded-full hover:bg-[var(--hover-blue)] hover:border-transparent hover:text-white transition-colors duration-150 font-medium text-sm flex-1"><BadgeCheck size={16} fill="#1E90FE" stroke="#fff"/>Verify?</Link>}
                    </div>
                </div>
            )}
        </>
    );
}