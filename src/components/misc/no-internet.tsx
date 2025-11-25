"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useEffect, useState } from "react";

export function NoInternet() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const checkOnline = () => setOnline(navigator.onLine);

    checkOnline();
    window.addEventListener("online", checkOnline);
    window.addEventListener("offline", checkOnline);

    return () => {
      window.removeEventListener("online", checkOnline);
      window.removeEventListener("offline", checkOnline);
    };
  }, []);

  if (online) return null;

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WifiOff />
        </EmptyMedia>
        <EmptyTitle>No Internet Connection</EmptyTitle>
        <EmptyDescription>
          Please check your network connection and try again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex items-center justify-center text-sm border-t px-2 py-1 rounded-full hover:bg-[var(--hover)] border border-solid border-[var(--border-color)]">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
