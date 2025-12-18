// app/components/Categories.tsx
"use client";

import {
  memo,
  useCallback,
  useState,
  useTransition,
  useRef,
  useEffect,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  name: string;
}

interface CategoryProps {
  categories?: Category[];
  onCategorySelect?: (category: string) => void;
}

const defaultCategories: Category[] = [
  { name: "All" },
  { name: "Company" },
  { name: "Startup" },
  { name: "Entrepreneur" },
  { name: "Small Business" },
  { name: "Freelancer" },
  { name: "Creator" },
  { name: "Professional" },
  { name: "Student" },
  { name: "Investor" },
  { name: "Marketing" },
  { name: "Sales" },
  { name: "Engineering" },
  { name: "Product" },
  { name: "Design" },
  { name: "Technology" },
  { name: "Media" },
  { name: "Education" },
  { name: "Consulting" },
  { name: "Non-Profit" },
  { name: "Government" },
  { name: "Human Resources" },
  { name: "Operations" },
  { name: "Finance" },
  { name: "Legal" },
  { name: "Healthcare" },
  { name: "Real Estate" },
  { name: "Manufacturing" },
  { name: "Retail" },
  { name: "Other" },
];

const Categories = memo(function Categories({
  categories = defaultCategories,
  onCategorySelect,
}: CategoryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Remove the "All" entry from the scroll list (we render it separately)
  const uniqueCategories = categories.filter((cat) => cat.name !== "All");

  const handleClick = useCallback(
    (name: string) => {
      setPendingCategory(name);

      startTransition(() => {
        setActiveCategory(name);
        setPendingCategory(null);
        onCategorySelect?.(name);
      });
    },
    [onCategorySelect]
  );

  const getCategoryClass = useCallback(
    (name: string) => { 
      const isActive = activeCategory === name || pendingCategory === name;
      return [
        "flex items-center px-3 py-1.5 rounded-xl cursor-pointer transition-colors duration-200 text-sm",
        "border border-solid border-[var(--border)]",
        isActive
          ? "bg-[var(--background-primary)] text-[var(--text)]"
          : "bg-[var(--background-secondary)] text-[var(--text-secondary)]",
        "whitespace-nowrap flex-shrink-0",
      ].join(" ");
    },
    [activeCategory, pendingCategory]
  );

  // scroll logic
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    const isAtEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 1;
    setShowRightArrow(!isAtEnd);
  }, []);

  const scrollHorizontally = useCallback((direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth / 2;
    el.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // initial check
    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="py-3 top-0 z-10 w-full transition-shadow duration-300">
      <div className="relative flex items-center h-8">
        {/* Left scroll control (visible when you can scroll left) */}
        {showLeftArrow && (
          <div className="absolute left-0 z-20 h-full flex items-center pointer-events-none">
            <div className="w-12 h-full bg-gradient-to-r from-[var(--background-secondary)] to-transparent" />
            <button
              onClick={() => scrollHorizontally("left")}
              className="flex items-center justify-center p-2 rounded-full shadow-lg pointer-events-auto text-[var(--text)] bg-[var(--background-secondary)] transition-all duration-150 ml-[-8px]"
              aria-label="Scroll categories left"
              style={{ width: 40, height: 40, flexShrink: 0 }}
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 overflow-x-auto whitespace-nowrap px-4 py-4 transition-all duration-300 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Categories"
        >
          {/* All */}
          <div
            role="button"
            tabIndex={0}
            aria-pressed={activeCategory === "All"}
            onClick={() => handleClick("All")}
            onKeyDown={(e) => e.key === "Enter" && handleClick("All")}
            className={getCategoryClass("All")}
          >
            <span className="font-medium">All</span>
          </div>

          {uniqueCategories.map((cat) => (
            <div
              key={cat.name}
              role="button"
              tabIndex={0}
              aria-pressed={activeCategory === cat.name}
              onClick={() => handleClick(cat.name)}
              onKeyDown={(e) => e.key === "Enter" && handleClick(cat.name)}
              className={getCategoryClass(cat.name)}
            >
              <span className="font-medium">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Right scroll control (visible when not at end) */}
        {showRightArrow && (
          <div className="absolute right-8 z-20 h-full flex items-center pointer-events-none">
            <div className="w-12 h-full" />
            <button
              onClick={() => scrollHorizontally("right")}
              className="flex items-center justify-center p-2 rounded-full shadow-lg pointer-events-auto text-[var(--text)] bg-[var(--background-secondary)] transition-all duration-150 ml-[-8px]"
              aria-label="Scroll categories right"
              style={{ width: 40, height: 40, flexShrink: 0 }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export { Categories };
