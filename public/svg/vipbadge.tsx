// src/components/VIPBadge.tsx
import React from "react";

export default function VIPBadge() {
  return (
    <span className="relative flex items-center justify-center z-10">
      <svg
        width="25"
        height="25"
        viewBox="0 0 512 512"
        fill="none"
        style={{
          filter: "drop-shadow(0 0 5px rgba(255, 215, 0, 0.8))",
        }}
      >
        <polygon
          points="256,499.47 512,146.167 414.217,12.53 97.784,12.53 0.001,146.167"
          fill="#DAA520"
        />
        <polygon
          points="97.786,12.53 170.663,146.172 0,146.172"
          fill="#FFD700"
        />
        <polygon
          points="414.217,12.53 341.327,146.172 255.995,12.53"
          fill="#FFD700"
        />
        <polygon
          points="341.327,146.172 255.995,499.467 170.663,146.172"
          fill="#FFC107"
        />
        <polygon
          points="414.217,12.53 511.99,146.172 341.327,146.172"
          fill="#FFA500"
        />
        <polygon
          points="255.995,12.53 341.327,146.172 170.663,146.172"
          fill="#FFEC8B"
        />
        <polygon
          points="170.663,146.172 255.995,499.467 0,146.172"
          fill="#FFA500"
        />
      </svg>
      <span className="absolute text-black font-semibold text-[7.5px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        ViP
      </span>
    </span>
  );
}