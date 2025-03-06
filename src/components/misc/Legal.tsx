
interface LegalProps {
    className?: string; // Add className to the props interface
}

export default function Legal({ className }: LegalProps) {
    return (
        <footer className={`bg-[var(--background-primary)] p-4 ${className}`}>
            <ul className="flex flex-wrap justify-center space-x-4 mb-4">
                <li>
                    <a href="https://x.com/VicsoryApp" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-[var(--blue)]">
                        Terms of Service
                    </a>
                </li>
                <li>
                    <a href="https://x.com/VicsoryApp" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-[var(--blue)]">
                        Privacy Policy
                    </a>
                </li>
                <li>
                    <a href="https://x.com/VicsoryApp" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-[var(--blue)]">
                        Cookie Policy
                    </a>
                </li>
                <li>
                    <a href="https://x.com/VicsoryApp" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-[var(--blue)]">
                        Imprint
                    </a>
                </li>
                <li>
                    <a href="https://x.com/VicsoryApp" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-[var(--blue)]">
                        Accessibility
                    </a>
                </li>
            </ul>
            <div className="text-center">
                <p className="text-sm text-muted">
                    © {new Date().getFullYear()} Vicsory. All rights reserved.
                </p>
            </div>
        </footer>
    );
}