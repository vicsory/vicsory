"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background-secondary)]">
            <div
                className="shadow-lg rounded-lg p-8 max-w-md w-full text-center space-y-6 border border-solid border-[var(--border)] bg-[var(--background-primary)]"
            >
                <Image
                    src="/assets/favicon.png"
                    alt="Logo"
                    width={75}
                    height={75}
                    className="mx-auto"
                />
                <h1 className="text-2xl font-bold text-[var(--text)]">
                    Something Went Wrong!
                </h1>
                <p className="text-sm text-[var(--text)]">
                    We apologize for the inconvenience. Please try again.
                </p>
                <Button
                    className="flex items-center justify-center text-sm text-[var(--text)] px-4 py-1 rounded-full hover:bg-[var(--background-secondary)] border border-solid border-[var(--border)]"
                    onClick={() => reset()}
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
}
