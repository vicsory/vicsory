"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VicsoryCard() {
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
        bg-gradient-to-br from-blue-400 to-blue-700
        text-white
      "
    >
      <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
        {/* LEFT: Text + Button */}
        <div className="flex flex-col justify-between w-full md:w-1/2 mb-4 md:mb-0">
          <div>
            <h2 className="text-lg md:text-2xl font-semibold mb-2">
              Vicsory: Connect, Share, and Grow Your Network
            </h2>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-3">
             Unlock a network where achievements matter and meaningful professional relationships are built.
            </p>
          </div>

          <Button
            size="lg"
            className="bg-white text-blue-700 font-semibold hover:bg-blue-50 transition rounded-xl py-3 text-sm mt-3"
          >
            Learn More
          </Button>
        </div>

        {/* RIGHT: Image */}
        <div className="w-full md:w-1/2 h-48 md:h-64 flex items-baseline">
          <Image
            src="/assets/girl-lp.png"
            alt="Victory App"
            width={567} // adjust depending on image size
            height={801} // adjust depending on image size
            className="object-contain rounded-xl"
          />
        </div>
      </CardContent>
    </Card>
  );
}

