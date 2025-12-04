"use client";

import Link from "next/link";

export default function Legal() {
    return (
        <footer className="w-full mt-6 flex flex-col items-center">
            <div className="flex text-base flex-wrap gap-4 justify-center mb-3">
                <Link
                    href="/term-of-service"
                    className="text-[var(--text-secondary)] hover:text-[var(--blue)]"
                >
                    Terms of Service
                </Link>
                <Link
                    href="/TermOfService"
                    className="text-[var(--text-secondary)] hover:text-[var(--blue)]"
                >
                    Privacy Policy
                </Link>
                <Link
                    href="/TermOfService"
                    className="text-[var(--text-secondary)] hover:text-[var(--blue)]"
                >
                    Cookie Policy
                </Link>
                <Link
                    href="/TermOfService"
                    className="text-[var(--text-secondary)] hover:text-[var(--blue)]"
                >
                    Imprint
                </Link>
                <Link
                    href="/TermOfService"
                    className="text-[var(--text-secondary)] hover:text-[var(--blue)]"
                >
                    Accessibility
                </Link>
            </div>

            <div className="text-center">
                <p className="text-[var(--text-secondary)]">
                    © {new Date().getFullYear()} Vicsory. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
