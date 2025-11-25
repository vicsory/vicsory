"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button"; // Adjust path based on your setup

export default function GlobalError({ reset }: { error: Error; reset?: () => void }) {
  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload(); // Fallback if reset isn’t provided
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background-secondary)]">
      <div
        className="shadow-lg rounded-lg p-8 max-w-md w-full text-center space-y-6 border"
        style={{ backgroundColor: "var(--background-primary)", borderColor: "var(--border-color)" }}
      >
        <Image
          src="/assets/favicon.png"
          alt="Logo"
          width={75}
          height={75}
          className="mx-auto"
        />
        <h1 className="text-2xl font-bold" style={{ color: "var(--active-mode)" }}>
          Something Went Wrong!
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          We apologize for the inconvenience. Please try again.
        </p>
        <Button
          onClick={handleReset}
          className="w-full"
          style={{ backgroundColor: "var(--blue)", color: "white" }}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}