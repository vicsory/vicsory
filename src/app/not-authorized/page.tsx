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

export default function AuthErrorPage() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia >
                    <Image
                        src="/assets/favicon.png"
                        alt="Logo"
                        width={75}
                        height={75}
                        className="mx-auto"
                    />
                </EmptyMedia>
                <EmptyTitle>You are not authorized to view this page.</EmptyTitle>
                <EmptyDescription>
                    Return to the homepage
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Link href="/">
                    <Button className="flex items-center justify-center text-sm border-t px-4 py-1 rounded-full hover:bg-[var(--hover)] border border-solid border-[var(--border-color)]">
                        Back
                    </Button>
                </Link>
            </EmptyContent>
        </Empty>
    );
}
