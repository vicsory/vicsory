"use cache";

import { Suspense } from "react";
import { Categories } from "./categories";

export default async function Category({ }: { onSelect?: (c: string) => void }) {
  return (
    <Suspense fallback={<div className="p-2">Loading…</div>}>
      <Categories/>
    </Suspense>
  );
}
