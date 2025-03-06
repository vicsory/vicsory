"use client";


import { useState } from "react";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import { Share2 } from "lucide-react";

export default function Share({ postUrl }: { postUrl: string }) {
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const handleCopy = () => {
        try {
            navigator.clipboard.writeText(postUrl);
            setSnackbar({ message: "Post link is copied to the clipboard.", severity: "success", open: true });
        } catch (error) {
            return console.log(error);
        }
    };

    // Define consistent icon size matching the Like component
    const iconSize = 16;

    return (
        <>
            <button
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
                onClick={handleCopy}
            >
                <Share2 size={iconSize} />
            </button>
            {snackbar.open && (
                <CustomSnackbar 
                    message={snackbar.message} 
                    severity={snackbar.severity} 
                    setSnackbar={setSnackbar} 
                />
            )}
        </>
    );
}