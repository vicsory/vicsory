"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia>
                    <Image
                        src="/assets/favicon.png"
                        alt="Logo"
                        width={75}
                        height={75}
                        className="mx-auto"
                    />
                </EmptyMedia>
                <EmptyTitle className="text-[var(--text)]">Sorry, that page doesn’t exist!</EmptyTitle>
                <EmptyDescription className="text-[var(--text)]">
                    It seems we can’t find what you’re looking for.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Link href="/">
                    <Button className="flex items-center justify-center text-sm text-[var(--text)] px-4 py-1 rounded-full hover:bg-[var(--background-secondary)] border border-solid border-[var(--border)]">
                        Back
                    </Button>
                </Link>
            </EmptyContent>
        </Empty>
    );
}
