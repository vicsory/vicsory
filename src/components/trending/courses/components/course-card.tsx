"use client";

import React, { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { MustLogin } from "../../must-login/must-login";

interface CourseCategory {
  id: string;
  label: string;
}

interface CourseProps {
  title?: string;
  exploreAllText?: string;
  onExploreAll?: () => void;
  onLogInClick?: () => void;
}

const categories: CourseCategory[] = [
  { id: "programming", label: "Programming" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
];

const categoryData: Record<string, number[]> = {
  programming: [1, 2, 3, 4],
  design: [1, 2, 3, 4],
  marketing: [1, 2, 3, 4],
};

export default function CourseCardTabs({
  title = "Explore Courses",
  exploreAllText = "Explore All",
  onExploreAll,
  onLogInClick,
}: CourseProps) {
  const [active, setActive] = useState<string>("programming");

  const handleClick = useCallback((id: string) => setActive(id), []);
  const handleExploreClick = useCallback(() => {
    if (onLogInClick) onLogInClick();
    else onExploreAll?.();
  }, [onExploreAll, onLogInClick]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-4 py-2">
        <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
        <button
          type="button"
          onClick={handleExploreClick}
          className="inline-flex items-center gap-1 text-sm sm:text-base text-[#0056d2] hover:underline focus:outline-none focus:underline"
        >
          <span>{exploreAllText}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Category Pills */}
      <div className="overflow-x-auto w-full rounded-md border-y border-solid border-[var(--border-color)]">
        <div className="flex gap-2 px-2 py-2 items-center whitespace-nowrap">
          {categories.map((cat) => {
            const selected = cat.id === active;
            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className={`border border-solid border-[var(--border-color)] flex-shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2
                  text-sm sm:text-base font-medium min-w-fit transition-all
                  ${selected ? "bg-white shadow-sm text-gray-700" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                aria-pressed={selected}
                role="tab"
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="overflow-x-auto pb-4 py-2">
        <div className="flex gap-4 px-2">
          {categoryData[active]?.map((_, idx) => (
            <div
              key={idx}
              className="min-w-[180px] p-3 bg-white rounded-xl shadow-sm flex flex-col gap-2"
            >
              <p className="font-semibold text-gray-800">***</p>
              <p className="text-gray-500 text-sm">Confidential</p>
              <p className="text-gray-400 text-xs">Duration: ***</p>
              <button
                onClick={onLogInClick}
                className="mt-auto bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm"
              >
                Enroll
              </button>
            </div>
          ))}

          {/* Must login card */}
          <div className="flex justify-center px-16 w-full">
            <MustLogin />
          </div>
        </div>
      </div>

      {/* Fallback */}
      {categoryData[active]?.length === 0 && (
        <div className="flex justify-center py-2">
          <MustLogin />
        </div>
      )}

      {/* Hide scrollbars */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
        div {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
