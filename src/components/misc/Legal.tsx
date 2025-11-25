import Link from "next/link";

interface LegalProps {
    className?: string; // Add className to the props interface
}

export default function Legal({ className }: LegalProps) {
    return (
        <footer className={`p-4 ${className}`}>
            <ul className="flex flex-wrap justify-center space-x-4 mb-4">
                <Link
                    href="/term-of-service"
                    className="text-xs text-muted hover:text-[var(--blue)]"
                >
                    Terms of Service
                </Link>
                <Link
                    href="/TermOfService"
                    className="text-xs text-muted hover:text-[var(--blue)]"
                >
                    Privacy Policy
                </Link>
                <Link
                    href="/TermOfService"
                    className="text-xs text-muted hover:text-[var(--blue)]"
                >
                    Cookie Policy
                </Link>
                <Link
                    href="/TermOfService"
                    className="text-xs text-muted hover:text-[var(--blue)]"
                >
                    Imprint
                </Link>
                <Link
                    href="/TermOfService"
                    className="text-xs text-muted hover:text-[var(--blue)]"
                >
                    Accessibility
                </Link>
            </ul>
            <div className="text-center">
                <p className="text-xs text-muted">
                    © {new Date().getFullYear()} Vicsory. All rights reserved.
                </p>
            </div>
        </footer>
    );
}