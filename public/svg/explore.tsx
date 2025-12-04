import React from "react";

const HashtagFill: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M10 3h2v4h4v2h-4v4h-2v-4H6V7h4V3zm-6 8h2v2H4v-2zm14 0h2v2h-2v-2zM4 17h2v2H4v-2zm14 0h2v2h-2v-2z" />
    </svg>
  );
};

const HashtagOutline: React.FC<{ className?: string; strokeWidth?: number }> = ({
  className = "w-6 h-6",
  strokeWidth = 2,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="10" y2="21" />
      <line x1="14" y1="3" x2="14" y2="21" />
    </svg>
  );
};

export { HashtagFill, HashtagOutline };
