"use client";

import { JSX, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

interface Popup {
  id: number;
  text: string;
  left: number;
}

export function UserLoginPopups(): JSX.Element {
  const [popups, setPopups] = useState<Popup[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const randomCount = Math.floor(Math.random() * 3) + 1;
      const newPopup: Popup = {
        id,
        text: `+${randomCount} user${randomCount > 1 ? "s" : ""} logged in`,
        left: Math.random() * 80, // random left position (0–80%)
      };

      // Add popup
      setPopups((prev) => [...prev, newPopup]);

      // Remove popup after 2.5s
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 2500);
    }, 2500); // every 2.5 seconds — repeats forever

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute left-0 w-full overflow-visible pointer-events-none">
      <AnimatePresence>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bg-[var(--blue)] text-white text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1"
            style={{
              left: `${popup.left}%`,
              top: `${Math.random() * 50}px`, // random vertical offset
              whiteSpace: "nowrap",
            }}
          >
            <User size={14} />
            {popup.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
