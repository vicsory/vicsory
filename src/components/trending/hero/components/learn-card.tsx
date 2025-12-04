"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LearnCard() {
  // Array of logos
  const logos = [
    { src: "/assets/microsoft.png", alt: "Microsoft" },
    { src: "/assets/meta.png", alt: "Meta" },
    { src: "/assets/google.png", alt: "Google" },
    { src: "/assets/aws.png", alt: "AWS" },
    { src: "/assets/adobe.png", alt: "Adobe" },
    { src: "/assets/coursera.png", alt: "Coursera" },
  ];

  return (
    <Card
      className="
        group
        w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
        mx-auto
        relative
        overflow-hidden
        rounded-2xl
        shadow-md
        transition-all
        duration-300
        bg-white
        text-black
        border border-solid border-[var(--border-color)]
      "
    >
      <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
        {/* LEFT: Text + Button */}
        <div className="flex flex-col justify-between w-full md:w-1/2 mb-4 md:mb-0">
          <div>
            <h2 className="text-lg md:text-2xl font-semibold mb-2">
              Learn from Top Experts
            </h2>
            <p className="text-sm md:text-base leading-relaxed mb-3">
              Access courses, tutorials, and resources from leading tech companies to boost your skills and advance your career.
            </p>
          </div>

          <Button
            size="lg"
            className="bg-white text-blue-700 font-semibold hover:bg-blue-50 transition rounded-xl py-3 text-sm mt-3 border border-solid border-[var(--border-color)]"
          >
            Join Now
          </Button>
        </div>

        {/* RIGHT: Logos */}
        <div className="w-full md:w-1/2 h-48 md:h-64 grid grid-cols-3 gap-2 items-center justify-center">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center w-20 h-10" // fixed size for each logo container
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={40} // actual image size inside container
                height={20}
                className="object-contain"
              />
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}
