"use client";

import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Image from "next/image";

import { PreviewDialogProps } from "@/types/DialogProps";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { Button } from "../ui/button";

export default function PreviewDialog({
    open,
    handlePreviewClose,
    url,
    urls = [],
    initialIndex = 0,
}: PreviewDialogProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handlePreviewClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [handlePreviewClose]);

    const images = urls.length > 0 ? urls : url ? [url] : [];

    if (!open || images.length === 0) return null;

    const prevImage = () => setCurrentIndex((i) => (i > 0 ? i - 1 : i));
    const nextImage = () => setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : i));

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handlePreviewClose}
        >
            <div
                className="relative w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <Button
                    onClick={handlePreviewClose}
                    className="absolute -top-10 right-0 p-2 rounded-full bg-[var(--background-primary)] hover:bg-[var(--background-secondary)] shadow-lg"
                >
                    <AiOutlineClose className="text-[var(--text)]" size={20} />
                </Button>

                {/* Left / Right arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            disabled={currentIndex === 0}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white disabled:opacity-40 transition"
                        >
                            <AiOutlineLeft size={30} />
                        </button>
                        <button
                            onClick={nextImage}
                            disabled={currentIndex === images.length - 1}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white disabled:opacity-40 transition"
                        >
                            <AiOutlineRight size={30} />
                        </button>
                    </>
                )}

                {/* Image */}
                <div className="relative w-full h-[70vh] rounded-xl overflow-hidden border border-[var(--border)] bg-black">
                    <Image
                        src={
                            images[currentIndex] === "/assets/header.jpg" ||
                            images[currentIndex] === "/assets/egg.jpg"
                                ? images[currentIndex]
                                : getFullURL(images[currentIndex])
                        }
                        alt={`preview ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-full select-none">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>
        </div>
    );
}
